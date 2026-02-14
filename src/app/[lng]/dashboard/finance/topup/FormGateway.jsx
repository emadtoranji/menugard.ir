'use client';

import { NumericFormat } from 'react-number-format';
import {
  iranianGatewayAmountRange,
  MAIN_CURRENCY,
} from '@utils/globalSettings';
import { formatNumber, numberToEnglish } from '@utils/numbers';
import { useState } from 'react';
import { useT } from '@i18n/client';
import Spinner from '@components/Spinner';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const presetAmounts = [50000, 100000, 250000, 500000];

export default function GatewayForm({ gateway, currentLang }) {
  const { t } = useT('dashboard');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');

  function handleSetAmount(value) {
    value = numberToEnglish(value);
    setAmount(value || '');
  }

  function handleCreateBill() {
    const numAmount = Number(amount);
    if (!amount || numAmount <= 0) {
      toast.error(t('dashboard.finance.invalidAmount'));
      return;
    }
    if (
      numAmount < iranianGatewayAmountRange.min ||
      numAmount > iranianGatewayAmountRange.max
    ) {
      toast.error(
        t('dashboard.finance.amountRangeInvalid', {
          min: formatNumber(iranianGatewayAmountRange.min, currentLang),
          max: formatNumber(iranianGatewayAmountRange.max, currentLang),
        }),
      );
      return;
    }

    setLoading(true);

    fetch('/api/dashboard/topup-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gateway,
        amount,
        currency: MAIN_CURRENCY,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result?.ok) {
          setAmount('');
          toast.success(
            t(
              `code-responses.${result?.message}`,
              t('dashboard.finance.topupDone'),
            ),
          );
          router.push(result.result.payment_url);
        } else {
          toast.error(
            t(
              `code-responses.${result?.message}`,
              t('general.unknown-problem'),
            ),
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });

    setLoading(false);
  }

  return (
    <>
      <div className='grid grid-cols-1 grid-cols-sm-2 grid-cols-md-4 gap-1 mb-3'>
        {presetAmounts.map((preset) => (
          <div key={preset} className='w-full'>
            <button
              className={`btn btn-sm ${
                amount == preset ? 'btn-success' : 'btn-secondary'
              } w-full flex justify-center items-center gap-1`}
              onClick={() => handleSetAmount(preset)}
            >
              <span>{formatNumber(preset, currentLang)}</span>
              <span>{t(`currencies.${MAIN_CURRENCY}`)}</span>
            </button>
          </div>
        ))}
      </div>
      <div className='col-7 mx-auto'>
        <div className=''>
          <div className='form-floating w-full'>
            <NumericFormat
              id='floatingInputAmountTopUp'
              name='amount'
              type='numeric'
              inputMode='numeric'
              placeholder={''}
              className='form-control border-dark'
              style={{ textAlign: 'left', direction: 'ltr' }}
              min={iranianGatewayAmountRange.min}
              max={iranianGatewayAmountRange.max}
              onChange={(e) => {
                handleSetAmount(e.target.value);
              }}
              value={amount}
              autoComplete='off'
              allowNegative={false}
              thousandSeparator=','
              decimalSeparator='.'
              decimalScale={0}
            />
            <label
              htmlFor='floatingInputAmountTopUp'
              className='currency-font mx-1 end-0 font-bold text-xl'
            >
              {t(
                `currencies.${String(MAIN_CURRENCY).toLowerCase()}`,
                MAIN_CURRENCY,
              )}
            </label>
          </div>
        </div>
        <div className='flex justify-center mt-2'>
          <button
            className='btn btn-success'
            type='button'
            onClick={handleCreateBill}
            disabled={loading || !amount}
          >
            {loading ? <Spinner /> : t('dashboard.finance.create-invoice')}
          </button>
        </div>
      </div>
    </>
  );
}
