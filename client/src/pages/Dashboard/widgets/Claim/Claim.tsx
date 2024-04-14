import { Button } from 'components/Button';
import { useState } from 'react';

function getCurrentUnixTimestamp(): number {
    return Math.floor(Date.now() / 1000);
}

export const Claim = () => {
    const [done, setDone] = useState(false);

    const acquire = async () => {
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

