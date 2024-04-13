import { useGetAccountInfo } from 'hooks';
import { ComboBox } from './components';
import {TextField, Flex, View } from '@adobe/react-spectrum';
import axios, { AxiosResponse } from 'axios';
import './inheritance.css'
import { Button } from 'components/Button';
import { useState } from 'react';
import { Spinner } from './components/Spinner';

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

const endpoint = ""

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

  const sendWillRequest = async () => {
    console.log(inputText);
    console.log(amountText);
    console.log(currency);
    setLoading(true)

    const requestBody: RequestBody = {
      src: address,
      dest: inputText,
      amount: parseInt(amountText),
      currency: currency
    }

    try {
      // Make a POST request with the body
      const response: AxiosResponse = await axios.post(endpoint, requestBody);
  
      // Handle the response
      console.log('Response:', response.data);
    } catch (error) {
      // Handle errors
      console.error('Error:', error);
    }
    // setLoading(false);
    // setDone(true);
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

