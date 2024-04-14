import { Button } from 'components/Button';
import { useState, useEffect } from 'react';
import { useGetAccountInfo } from 'hooks';
import { ServerClass } from "@genezio-sdk/genezio-project"
import axios, { AxiosResponse } from 'axios';

function getCurrentUnixTimestamp(): number {
    return Math.floor(Date.now() / 1000);
}

export const Claim = () => {
    const [done, setDone] = useState(false);
    const { address, account } = useGetAccountInfo();
    const contractAddress = ServerClass.getContractAddress(address);

    const acquire = async () => {
        const contract = await ServerClass.getContractAddress(address);
        const currentUnixTimestamp = getCurrentUnixTimestamp();
        console.log(currentUnixTimestamp);

        const url : string = 'https://127.0.0.1:5000/run_command'
        const contractAddress = await ServerClass.getContractAddress("erd1vejafh44q9xvh2vvdfs6y4uthcgpf5ut8hvj75hfg7xh8hg7a73q5myr0w");

        // code for claimInheritance    
        const addClaimCommand : string = 'mxpy contract call ' + contractAddress + ' --recall-nonce \
        --gas-limit=100000000 --proxy="https://devnet-gateway.multiversx.com" --function claimInheritance  \
        --pem=/home/radu/maria.pem --arguments \
        str:TOKEN-cfb31a --send'

        console.log(addClaimCommand)
    
        const jsonData2 = {
          command : addClaimCommand
        };
    
        console.log(addClaimCommand)
    
        setTimeout(() => {
          const res2 = axios.post(url, jsonData2)
          console.log(res2)
        }, 3000);

        alert("You have received 4096 TOKEN-cfb31a")
        setDone(true);
    } 


    return(  
    !done ? <Button
        disabled={false}
        onClick={() => acquire()}
        data-testid='btnPingService'
        data-cy='transactionBtn'
    >
        Claim Assets
    </Button> : <>All done...</>)
};

