'use client';

import { useCopyToClipboard } from '@utils/useCopyToClipboard';
import './style.css';

export default function BankCard({
  card_number = '',
  iban = '',
  account_number = '',
}) {
  const makeCopyToClipboard = useCopyToClipboard();

  return (
    <div className='bank-card flex items-center justify-center mx-auto p-2 w-8/12 rounded'>
      <div className='text-center py-3 text-black'>
        <h5
          className='select-all cursor-pointer font-semibold mb-2'
          onClick={
            card_number ? () => makeCopyToClipboard(card_number) : undefined
          }
          style={{ direction: 'ltr', letterSpacing: '2px' }}
        >
          {card_number
            ? card_number.replace(/(\d{4})(?=\d)/g, '$1 ')
            : '---- ---- ---- ----'}
        </h5>
        <div className='flex justify-center items-center flex-col'>
          {account_number ? (
            <small
              className='mb-1'
              onClick={
                account_number
                  ? () => makeCopyToClipboard(account_number)
                  : undefined
              }
            >
              {t('bank-accounts.account-number')} : {account_number || '---'}
            </small>
          ) : undefined}
          <h6
            className='select-all cursor-pointer font-bold mt-3'
            onClick={iban ? () => makeCopyToClipboard(iban) : undefined}
            style={{ direction: 'ltr' }}
          >
            {iban
              ? iban.replace(/(\d{4})(?=\d)/g, '$1 ')
              : 'IR---- ---- ---- ---- ---- ---- -----'}
          </h6>
        </div>
      </div>
    </div>
  );
}
