import { Button } from 'components/Button';
import { useState, useEffect } from 'react';
import { useGetAccountInfo } from 'hooks';
import { ServerClass } from "@genezio-sdk/genezio-project"

function getCurrentUnixTimestamp(): number {
    return Math.floor(Date.now() / 1000);
}

export const Claim = () => {
    const [done, setDone] = useState(false);
    const { address, account } = useGetAccountInfo();

    const acquire = async () => {
        const contract = await ServerClass.getContractAddress(address);
        const currentUnixTimestamp = getCurrentUnixTimestamp();
        console.log(currentUnixTimestamp);

        // code for claimInheritance
    
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

