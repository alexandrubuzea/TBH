import { Label } from 'components/Label';
import { OutputContainer } from 'components/OutputContainer';
import { FormatAmount } from 'components/sdkDappComponents';
import { useGetAccountInfo, useGetNetworkConfig } from 'hooks';
import { Username } from './components';
import axios, { AxiosResponse } from 'axios';
import { get } from 'http';
import { useEffect, useState } from 'react';

const endpoint = "https://devnet-gateway.multiversx.com/address/erd194jfa28ulagr2nc65kv9emlay78eyhnnvs83qdxnqhvtcqrv49mqy2e45f/esdt"


async function getAssets(account : string) {
  const url = "https://devnet-gateway.multiversx.com/address/" + account + "/esdt"
  const res = await axios.get(url)
  console.log(res.data.data.esdts)
  const jsonParse = JSON.parse(JSON.stringify(res.data.data))
  return jsonParse.esdts
}

interface MyToken {
  name: string;
  amount: number;
}

function iterateObjectKeys(obj: { [key: string]: any }) {
  const keys : MyToken[] = []
  for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
          keys.push({
            name: key,
            amount : obj[key].balance
          })
      }
  }
  return keys
}


export const Account = () => {
  const { network } = useGetNetworkConfig();
  const { address, account } = useGetAccountInfo();

  const [data, setData] = useState<MyToken []>()
  useEffect(() => {
    getAssets(address).then((res) => {
      const keys = iterateObjectKeys(res)
      // console.log(keys)
      setData(keys)
    })
  }, [])


  // getAssets(address).then(esdts => console.log(esdts)).then(() => 
  return (
    <OutputContainer>
      <div className='flex flex-col text-black' data-testid='topInfo'>
        <p className='truncate'>
          <Label>Address: </Label>
          <span data-testid='accountAddress'> {address}</span>
        </p>

        <Username account={account} />
        <p>
          <Label>Shard: </Label> {account.shard}
        </p>

        

        {data ?  
          data?.map(entry => (
            <p>
            <Label>{entry.name}: </Label> {entry.amount}
              </p>
            )) : ""}
           
        <p>
          <Label>Balance: </Label>
          <FormatAmount
            value={account.balance}
            egldLabel={network.egldLabel}
            data-testid='balance'
          />
        </p>
      </div>
    </OutputContainer>
  );
};
