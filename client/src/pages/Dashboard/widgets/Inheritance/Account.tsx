import { useGetAccountInfo } from 'hooks';
import { ComboBox } from './components';
import {TextField, Flex, View, } from '@adobe/react-spectrum';
import './inheritance.css'
import { smartContract } from 'utils/smartContract';
import { Button } from 'components/Button';
import { useState, useCallback, useEffect} from 'react';
import { Spinner } from './components/Spinner';
import { getChainId } from 'utils/getChainId';
import {Datepicker} from './components/DatePicker'
// import { ServerClass } from "@genezio-sdk/genezio-project"
import {
  PingRawProps,
} from 'types/pingPong.types';
import { Address } from 'utils/sdkDappCore';
import { signAndSendTransactions } from 'helpers/signAndSendTransactions';

import DatePicker from './components/DatePicker';
import {TokenTransfer } from '@multiversx/sdk-core/out';

import axios, { AxiosResponse } from 'axios';


function combineDateTimeToUnixTimestamp(currentDate: Date): number {
  // Parse the given time string into hours, minutes, and seconds
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes =  now.getMinutes().toString().padStart(2, '0');
  const seconds =now.getSeconds().toString().padStart(2, '0');

  // Create a new Date object with the given date
  const combinedDateTime = new Date(currentDate);

  // Set the time components (hours, minutes, seconds) from the current time
  combinedDateTime.setHours(parseInt(hours));
  combinedDateTime.setMinutes(parseInt(minutes));
  combinedDateTime.setSeconds(parseInt(seconds));

  // Get the Unix timestamp in seconds and round it down
  return Math.floor(combinedDateTime.getTime() / 1000);
}

interface Option {
  id: number;
  label: string;
}

interface RequestBody {
  src: string,
  dest: string,
  amount: number,
  currency: string
}

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

const PING_TRANSACTION_INFO = {
  processingMessage: 'Processing Ping transaction',
  errorMessage: 'An error has occured during Ping',
  successMessage: 'Ping transaction successful'
};

export const Inheritance = () => {
  
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    getAssets(address).then((res) => {
      const keys = iterateObjectKeys(res)

      keys.map((key, idx) => options.push({id: idx, label: key.name} ))
    })
  }, [])

  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const { address, account } = useGetAccountInfo();
  const [inputText, setInputText] = useState('');
  const [amountText, setAmountText] = useState('');
  const [currency, setCurrency] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

 
  const sendPingTransactionFromAbi = useCallback(
		async ({ amount, callbackRoute }: PingRawProps) => {

      const command : string = 'mxpy contract deploy --bytecode=/home/radu/work/TBH/smart_contracts/will/output/will.wasm --pem=/home/radu/converted_wallet.pem --gas-limit=50000000 --proxy="https://devnet-gateway.multiversx.com" --recall-nonce --send --outfile "file.json" 1> /dev/null 2>&1  && jq -r \'.contractAddress\' file.json'
      console.log(command)

      const jsonData = {
        command : command,
      };

      const url : string = "https://127.0.0.1:5000/run_command"
      const res = await axios.post(url, jsonData)
      console.log(res)

      const contractAddress : string = res.data.output
      console.log(contractAddress)

      const addInheritorCommand : string = 'mxpy contract call ' + contractAddress + ' --recall-nonce \
      --gas-limit=100000000 --proxy="https://devnet-gateway.multiversx.com" --function "ESDTTransfer"  \
      --pem=/home/radu/converted_wallet.pem --arguments \
      str:TOKEN-cfb31a 0x1000 str:addInheritor $end_timestamp erd12jadfezmyqt7ph06496zfqrmvr96ptk3tzy0trg8xn94mfn03mdqrc9m6a 1713025394 --send'

      const jsonData2 = {
        command : addInheritorCommand
      };

      console.log(addInheritorCommand)

      setTimeout(() => {
        const res2 = axios.post(url, jsonData2)
        console.log(res2)
      }, 3000);

      // const TokenFoo = TokenTransfer.fungibleFromAmount(" MATA-91ddf8", 10, 0);

      // const transaction = smartContract.methodsExplicit
      // .withSingleESDTTransfer
      // .withGasLimit(20_000_0000)
      // .addInheritor()
      // .withSender(new Address(address))
      // .buildTransaction()

		  // clearAllTransactions();
	
		  // const sendTransaction = smartContract.methodsExplicit
      // .addInheritor()
			// .withSender(new Address(address))
			// .withGasLimit(60000000)
      // .withSingleESDTTransfer()
			// .withChainID(getChainId())
			// .buildTransaction();
	
		  // const sessionId = await signAndSendTransactions({
      //   transactions: [sendTransaction],
      //   callbackRoute,
      //   transactionsDisplayInfo: PING_TRANSACTION_INFO
		  // });
	
		  // sessionStorage.setItem(type, sessionId);
		  // setPingPongSessionId(sessionId);
		},
		[]
	);

  const sendWillRequest = async () => {

    try {
      const timestamp = combineDateTimeToUnixTimestamp(selectedDate);
      console.log(timestamp);

      const r = sendPingTransactionFromAbi({amount: amountText, callbackRoute: ""});

      const res = await ServerClass.postTransaction({
        from: address, to: inputText, amount: parseInt(amountText)
      });
   
      // console.log('Response:', res);
    } catch (error) {
      // Handle errors
      console.error('Error:', error);
    }
    // setLoading(false);
    setDone(true);
  };

  return (
    <View>
      <>
    {!done ? 
    (<>
    {!loading ?
    <>
    <Flex alignItems="center" marginBottom="10px" gap={'size-100'}>   
       <TextField
          value={inputText}
          onChange={setInputText}
          label="Inheritor address"
          UNSAFE_className='input-box-big'
        />       
    </Flex>
    <Flex alignItems="center" marginBottom="10px" gap={'size-100'}>
    <TextField
          value={amountText}
          onChange={setAmountText}
          label="Amount"
          UNSAFE_className='input-box-small'
        />
    <ComboBox options={options} onChange={(selectedOption: Option) => setCurrency(selectedOption.label)} />
    <Datepicker selected={selectedDate} onChange={handleDateChange} />
    </Flex>
    <div className='container'>
    <div className='btn'>
    <Button
            disabled={false}
            onClick={() => sendWillRequest()}
            data-testid='btnPingService'
            data-cy='transactionBtn'
          >
            Sign & Send
          </Button>
    </div>
    </div>
    </>:
    (<Spinner></Spinner>) }</>) :
    (<>
    <table className="table">
      <thead>
        <tr>
          <th>Address</th>
          <th>Amount</th>
          <th>Currency</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{inputText}</td>
          <td>{amountText}</td>
          <td>{currency}</td>
        </tr>
      </tbody>
    </table>
    </>)}
    </>
    </View> 
  );
};

