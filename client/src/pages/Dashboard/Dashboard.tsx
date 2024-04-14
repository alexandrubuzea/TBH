import { contractAddress } from 'config';
import { AuthRedirectWrapper } from 'wrappers';
import {
  Account,
  Inheritance,
  Transactions,
  Claim
} from './widgets';
import { useScrollToElement } from 'hooks';
import { Widget } from './components';
import { WidgetType } from 'types/widget.types';
import { useGetAccountInfo } from 'hooks';
import { ServerClass } from "@genezio-sdk/genezio-project"

const WIDGETS_INHERITOR: WidgetType[] = [
  {
    title: 'My account',
    widget: Account,
    description: 'Connected account details',
    reference: 'https://docs.multiversx.com/sdk-and-tools/sdk-dapp/#account'
  },
  {
    title: 'Claim Inheritance',
    widget: Claim,
    description: '',
    reference: 'https://docs.multiversx.com/sdk-and-tools/sdk-dapp/#account'
  },
  {
    title: 'Inheritance',
    widget: Inheritance,
    description: '',
    reference: 'https://docs.multiversx.com/sdk-and-tools/sdk-dapp/#account'
  },
  {
    title: 'Transactions (All)',
    widget: Transactions,
    description: 'List transactions for the connected account',
    reference:
      'https://api.elrond.com/#/accounts/AccountController_getAccountTransactions'
  },
];

const WIDGETS: WidgetType[] = [
  {
    title: 'My account',
    widget: Account,
    description: 'Connected account details',
    reference: 'https://docs.multiversx.com/sdk-and-tools/sdk-dapp/#account'
  },
  {
    title: 'Claim Inheritance',
    widget: Claim,
    description: '',
    reference: 'https://docs.multiversx.com/sdk-and-tools/sdk-dapp/#account'
  },
  {
    title: 'Inheritance',
    widget: Inheritance,
    description: '',
    reference: 'https://docs.multiversx.com/sdk-and-tools/sdk-dapp/#account'
  },
  {
    title: 'Transactions (All)',
    widget: Transactions,
    description: 'List transactions for the connected account',
    reference:
      'https://api.elrond.com/#/accounts/AccountController_getAccountTransactions'
  },
];


export const Dashboard = () => {
  useScrollToElement();

  const { address } = useGetAccountInfo();
  const widgets = ServerClass.isInheritor(address as string) ? WIDGETS_INHERITOR : WIDGETS;

  return (
    <AuthRedirectWrapper>
      <div className='flex flex-col gap-6 max-w-3xl w-full'>
        {widgets.map((element) => (
          <Widget key={element.title} {...element} />
        ))}
      </div>
    </AuthRedirectWrapper>
  );
};
