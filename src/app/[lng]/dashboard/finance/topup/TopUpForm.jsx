'use client';

import BankCard from '@components/BankCard';
import { useT } from '@i18n/client';
import { useState } from 'react';
import SelectGateway from './SelectGateway';
import FormGateway from './FormGateway';
import { allGateways } from '@utils/globalSettings';

export function TopUpForm({ currentLang }) {
  const { t } = useT('dashboard');

  const allGatewaysFiltered = allGateways.filter((f) => f.active);

  const [gateway, setGateway] = useState(allGatewaysFiltered[0]['id']);

  return (
    <div className='pb-3'>
      <div className='mb-8'>
        <SelectGateway
          allGatewaysFiltered={allGatewaysFiltered}
          gateway={gateway}
          setGateway={setGateway}
        />
      </div>
      <div className='mb-8'>
        {gateway === 'TRANSFER-IRANIAN-CARD' ? (
          <BankCard
            card_number={
              process.env.NEXT_PUBLIC_PAYMENT_TRANSFER_IRANIAN_CARD || ''
            }
            iban={process.env.NEXT_PUBLIC_PAYMENT_TRANSFER_IRANIAN_IBAN || ''}
            account_number={
              process.env.NEXT_PUBLIC_PAYMENT_TRANSFER_IRANIAN_ACCOUNT_NUMBER ||
              ''
            }
          />
        ) : (
          <FormGateway gateway={gateway} currentLang={currentLang} />
        )}
      </div>

      <div className='badge text-wrap lh-base text-black flex justify-center'>
        {gateway === 'IRANIAN'
          ? t('dashboard.finance.rial-description')
          : gateway === 'TRANSFER-IRANIAN-CARD'
            ? t('dashboard.finance.transfer-iranian-card-description')
            : gateway === 'CRYPTOCURRENCY'
              ? t('dashboard.finance.crypto-description')
              : undefined}
      </div>
    </div>
  );
}
