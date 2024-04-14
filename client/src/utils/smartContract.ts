import { contractAddress } from 'config';
import json from 'contracts/ping-pong.abi.json';
import willjson from 'contracts/will.abi.json';
import { AbiRegistry, Address, SmartContract } from './sdkDappCore';

// const abi = AbiRegistry.create(json);
const willabi = AbiRegistry.create(willjson);

export const smartContract = new SmartContract({
  address: new Address(contractAddress),
  abi: willabi,
});
