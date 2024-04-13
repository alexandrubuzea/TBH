import { Label } from 'components/Label';
import { OutputContainer } from 'components/OutputContainer';
import { FormatAmount } from 'components/sdkDappComponents';
import { useGetAccountInfo, useGetNetworkConfig } from 'hooks';
import { ComboBox } from './components';
import {TextField, Item, Flex, View, ListBox} from '@adobe/react-spectrum';
import './inheritance.css'
import { Button } from 'components/Button';
import { useState } from 'react';


interface Option {
  id: number;
  label: string;
}

export const Inheritance = () => {
  let options = [
    {id: 1, label: '1'},
    {id: 2, label: '2'},
    {id: 3, label: '3'},
    {id: 4, label: 'Currency'},
  ];

  const [inputText, setInputText] = useState('');
  const [amountText, setAmountText] = useState('');
  const [currency, setCurrency] = useState('');

  const sendWillRequest = () => {
    console.log(inputText);
    console.log(amountText);
    console.log(currency);
  };

  return (
    <View>
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
    </Flex>
    </View>
  );
};