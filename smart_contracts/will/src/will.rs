#![no_std]
use core::ops::Deref;

#[allow(unused_imports)]

use multiversx_sc::imports::*;

multiversx_sc::derive_imports!();
#[derive(TopEncode, TopDecode, TypeAbi, PartialEq, Clone, Copy)]
pub enum Status {
    NotMature,
    Successful,
    NotInheritor,
}

#[multiversx_sc::contract]
pub trait WillESDT: 
{
    #[init]
    fn init(&self) {}

    #[view]
    fn status(&self, inheritor: &ManagedAddress, token: &TokenIdentifier) -> Status {
        if self.inheritance_mature_unix(inheritor, token).is_empty() {
            Status::NotInheritor
        } else if self.blockchain().get_block_timestamp() < self.inheritance_mature_unix(&inheritor, token).get() {
            Status::NotMature
        } else {
            Status::Successful
        }
    }

    fn handle_remove_inheritor(self, inheritor: &ManagedAddress, token: &TokenIdentifier) {
        let benefactor = self.blockchain().get_caller();
                
        let amount = self.per_token_inheritance(&inheritor, &token).get();
        self.send().direct_esdt(
            &benefactor,
            &token,
            0,
            &amount,
        );

        self.per_token_inheritance(&inheritor, &token).clear();
        self.inheritance_mature_unix(&inheritor, &token).clear();
        self.token_sum(token).update(|sum| *sum -= amount);
    }

    fn handle_new_inheritor(self, inheritor: &ManagedAddress, token: &TokenIdentifier, amount: &BigUint, end_timestamp: &u64) {
        if !self.per_token_inheritance(&inheritor, &token).is_empty() {
            self.remove_inheritor(inheritor, &token);
        }

        self.per_token_inheritance(&inheritor, &token).set(amount);
        self.inheritance_mature_unix(&inheritor, &token).set(end_timestamp);
        if self.token_sum(token).is_empty() {
            self.token_sum(token).set(amount)
        } else {
            self.token_sum(token).update(|sum| *sum += amount);
        }
    }

    #[endpoint(removeInheritor)]
    fn remove_inheritor(&self, inheritor: &ManagedAddress, token: &TokenIdentifier) {
        let benefactor = self.blockchain().get_caller();
        require!(self.blockchain().get_owner_address() == benefactor, "can't call contract if you are not owner");
        require!(!self.per_token_inheritance(&inheritor, &token).is_empty(), "there's no inheritor with this esdt");
        self.handle_remove_inheritor(&inheritor, &token);
    }

    #[endpoint(addInheritor)]
    #[payable("*")]
    fn add_inheritor(&self, inheritor: &ManagedAddress, end_timestamp: &u64) {
        let benefactor = self.blockchain().get_caller();
        require!(self.blockchain().get_owner_address() == benefactor, "can't call contract if you are not owner");

        let payment = self.call_value().single_esdt();
        let amount = payment.amount;
        let token = payment.token_identifier;
        self.handle_new_inheritor(&inheritor, &token, &amount, &end_timestamp);
    }

    #[endpoint(claimInheritance)]
    fn claim_inheritance(&self, token: &TokenIdentifier) {
        let caller = self.blockchain().get_caller();
        match self.status(&caller, token) {
            Status::NotMature => sc_panic!("cannot claim before mature date"),
            Status::Successful => {
                let amount = self.per_token_inheritance(&caller, &token).get();
                self.send().direct_esdt(
                    &caller,
                    &token,
                    0,
                    &amount,
                );
            },
            Status::NotInheritor => {
                sc_panic!("cannot claim if you are not an inheritor")
            },
        }
    }

    #[endpoint(addMultipleInheritors)]
    #[payable("*")]
    fn add_multiple_inheritors(&self, inheritors: ManagedVec<ManagedAddress>, tokens: ManagedVec<TokenIdentifier>, amounts: ManagedVec<BigUint>, end_timestamps: ManagedVec<u64>) {
        let benefactor = self.blockchain().get_caller();
        require!(self.blockchain().get_owner_address() == benefactor, "can't call contract if you are not owner");
        require!(inheritors.len() == tokens.len() && amounts.len() == tokens.len() && tokens.len() == end_timestamps.len(), "the number of amounts, inheritors, tokens and timestamps should be equal");
        
        for token in &tokens {
            self.token_sum(&token).clear();
        }

        for (inheritor, (token, (amount, end_timestamp))) in inheritors.iter().zip(tokens.iter().zip(amounts.iter().zip(end_timestamps.iter()))) {
            self.handle_new_inheritor(&inheritor, &token, &amount, &end_timestamp);
        }

        let payments = self.call_value().all_esdt_transfers().deref().clone();
        
        require!(payments.len() > 0, "at least one payment must be made");

        for payment in &payments {
            require!(!self.token_sum(&payment.token_identifier).is_empty(), "there's no inheritor with one of the given tokens");
            let entry = self.token_sum(&payment.token_identifier).get();
            require!(entry == payment.amount, "the amount of tokens paid should be fully split among inheritors");
        }
    }

    #[endpoint(removeMultipleInheritors)]
    fn remove_multiple_inheritors(&self, inheritors: ManagedVec<ManagedAddress>, tokens: ManagedVec<TokenIdentifier>) {
        let benefactor = self.blockchain().get_caller();
        require!(self.blockchain().get_owner_address() == benefactor, "can't call contract if you are not owner");
        require!(inheritors.len() == tokens.len(), "the number of inheritors and tokens should be equal");
        
        for (inheritor, token) in inheritors.iter().zip(tokens.iter()) {
            self.handle_remove_inheritor(&inheritor, &token);
        }
    }

    #[view(getPerTokenInheritance)]
    #[storage_mapper("perTokenInheritance")]
    fn per_token_inheritance(&self, inheritor: &ManagedAddress, token: &TokenIdentifier) -> SingleValueMapper<BigUint>;
    
    #[view(getInheritanceMatureUNIX)]
    #[storage_mapper("inheritanceMatureUNIX")]
    fn inheritance_mature_unix(&self, inheritor: &ManagedAddress, token: &TokenIdentifier) -> SingleValueMapper<u64>;

    #[storage_mapper("token_sum")]
    fn token_sum(&self, token: &TokenIdentifier) -> SingleValueMapper<BigUint>;
}
