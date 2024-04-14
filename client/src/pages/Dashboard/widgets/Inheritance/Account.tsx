import { useGetAccountInfo } from 'hooks';
import { ComboBox } from './components';
import {TextField, Flex, View, } from '@adobe/react-spectrum';
import axios, { AxiosResponse } from 'axios';
import './inheritance.css'
import { smartContract } from 'utils/smartContract';
import { Button } from 'components/Button';
import { useState, useCallback, useEffect} from 'react';
import { Spinner } from './components/Spinner';
import { getChainId } from 'utils/getChainId';
import { ServerClass, Transaction } from "@genezio-sdk/genezio-project"
import {
  PingRawProps,
  PingPongServiceProps,
  PongRawProps
} from 'types/pingPong.types';
import { Address } from 'utils/sdkDappCore';
import { signAndSendTransactions } from 'helpers/signAndSendTransactions';
// import DatePicker from './components/DatePicker';


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
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };
  const { address, account } = useGetAccountInfo();
  const [inputText, setInputText] = useState('');
  const [amountText, setAmountText] = useState('');
  const [currency, setCurrency] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendPingTransactionFromAbi = useCallback(
		async ({ amount, callbackRoute }: PingRawProps) => {

    //   exec('ls', (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`Error executing ls: ${error.message}`);
    //         return;
    //     }
    //     if (stderr) {
    //         console.error(`ls command encountered an error: ${stderr}`);
    //         return;
    //     }
    //     console.log(`ls command output:\n${stdout}`);
    // });

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

      const r = sendPingTransactionFromAbi({amount: amountText, callbackRoute: ""});

      const tr: Transaction = {
        from: address, to: inputText, amount: parseInt(amountText)
      }
      
      // // const res = await ServerClass.postTransaction(tr);
   
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
    {/* <DatePicker value={selectedDate} onChange={handleDateChange} /> */}
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
    </Flex></>:
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

