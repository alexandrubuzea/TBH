import { useGetAccountInfo } from 'hooks';
import { ComboBox } from './components';
import {TextField, Flex, View } from '@adobe/react-spectrum';
import axios, { AxiosResponse } from 'axios';
import './inheritance.css'
import { smartContract } from 'utils/smartContract';
import { Button } from 'components/Button';
import { useState, useCallback } from 'react';
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


const PING_TRANSACTION_INFO = {
  processingMessage: 'Processing Ping transaction',
  errorMessage: 'An error has occured during Ping',
  successMessage: 'Ping transaction successful'
};

export const Inheritance = () => {
  let options = [
    {id: 1, label: '1'},
    {id: 2, label: '2'},
    {id: 3, label: '3'},
    {id: 4, label: '4'},
  ];

  const { address, account } = useGetAccountInfo();

  const [inputText, setInputText] = useState('');
  const [amountText, setAmountText] = useState('');
  const [currency, setCurrency] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendPingTransactionFromAbi = useCallback(
		async ({ amount, callbackRoute }: PingRawProps) => {
		  // clearAllTransactions();
	
		  const pingTransaction = smartContract.methodsExplicit
      .addInheritor()
			.withSender(new Address(address))
			.withValue(amount ?? '0')
			.withGasLimit(60000000)
			.withChainID(getChainId())
			.buildTransaction();
	
		  const sessionId = await signAndSendTransactions({
			transactions: [pingTransaction],
			callbackRoute,
			transactionsDisplayInfo: PING_TRANSACTION_INFO
		  });
	
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

