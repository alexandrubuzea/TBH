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


export const Claim = () => {
  return(<></>)
};

