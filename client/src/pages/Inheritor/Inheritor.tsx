import { contractAddress } from 'config';
import { AuthRedirectWrapper } from 'wrappers';
import { useScrollToElement } from 'hooks';
import { Widget } from './components';
import { WidgetType } from 'types/widget.types';
import { Dialog } from '@adobe/react-spectrum';
import { useGetAccountInfo, useGetNetworkConfig } from 'hooks';
import {ComboBox, TextField, Item, Flex, View} from '@adobe/react-spectrum';

import { Button } from 'components/Button';
import React, { useState } from 'react';

interface ListItem {
  id: number;
  addr: string;
  data?: Data[];
}

interface Data {
  amount?: string;
  currency?: string;
}
export const Inheritor = () => {
  useScrollToElement();
  const { network } = useGetNetworkConfig();
  const { address, account } = useGetAccountInfo();

  let options = [
    {id: 1, addr: 'Aerospace'},
    {id: 2, addr: 'Mechanical'},
    {id: 3, addr: 'Civil'},
    {id: 4, addr: 'Biomedical'},
  ];

  const [inputText, setInputText] = useState('');
  const [amountText, setAmountText] = useState('');
  const [list, setList] = useState<ListItem[]>([]);

  const handleAddToList = () => {
    if (inputText.trim() !== '') {
      const newItem: ListItem = {
        id: list.length + 1,
        addr: inputText.trim()
      };
      setList([...list, newItem]);
      setInputText('');
    }
  };

  return (
    <AuthRedirectWrapper>
      <Dialog>
        <View>
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
    <ComboBox
        label="Currency"
        defaultItems={options}
        onSelectionChange={() =>console.log("change")}>
        {item => <Item>{item.addr}</Item>}
      </ComboBox> 
    </Flex>
    <Button
            disabled={false}
            onClick={handleAddToList}
            data-testid='btnPingService'
            data-cy='transactionBtn'
          >
            Add Inheritor
          </Button>
    </View>
        </View>
      </Dialog>
    </AuthRedirectWrapper>
  );
};
