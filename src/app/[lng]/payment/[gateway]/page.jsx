'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useT } from '@i18n/client';
import { useEffect, useState } from 'react';
import { formatNumber } from '@utils/numbers';
import toast from 'react-hot-toast';

function Placeholder() {
  return (
    <div className='flex grid grid-cols-1 gap-2 w-full p-3 bg-white rounded-3 shadow'>
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className='w-full bg-secondary placeholder rounded-3'
        ></div>
      ))}
    </div>
  );
}

function ShowStatus({ t, paymentData }) {
  const unknownStatus = ['103', 'pending', 'sending', '', null];
  const statusColor =
    paymentData.status === 'success'
      ? 'text-success'
      : unknownStatus.includes(paymentData.status)
        ? 'text-warning'
        : 'text-danger';
  const statusText =
    paymentData.status === 'success'
      ? t('payment.success')
      : unknownStatus.includes(paymentData.status)
        ? t('payment.unknown')
        : t('payment.failed');

  return (
    <div className='container'>
      <div className='w-auto md:w-8/12 lg:w-6/12 2xl:w-5/12 m-auto mt-5'>
        <div className='w-full p-3 bg-white rounded-3xl shadow-lg'>
          <h3 className='mb-3 text-center'>{t('payment.status')}</h3>
          <div className='flex gap-1 mb-3'>
            <strong>{t('payment.status')}:</strong>
            <span className={`font-bold ${statusColor}`}>{statusText}</span>
          </div>
          {paymentData.id && (
            <div className='mb-3'>
              <strong>{t('payment.order_id')}:</strong> {paymentData.id}
            </div>
          )}
          {paymentData.amount && (
            <div className='flex items-center gap-1 mb-3'>
              <strong>{t('payment.amount')}:</strong>
              {formatNumber(
                paymentData.amount,
                ['IRR', 'IRT'].includes(String(paymentData.currency))
                  ? 'fa'
                  : 'en',
              )}
              <span className='text-gray-600 text-sm currency-font h3'>
                {t(
                  `currencies.${String(paymentData.currency).toLowerCase()}`,
                  paymentData.currency,
                )}
              </span>
            </div>
          )}
          {paymentData.transaction_ref ? (
            <div className='flex gap-1 mb-3'>
              <strong>{t('payment.transaction_ref')}:</strong>
              <span>{paymentData.transaction_ref}</span>
            </div>
          ) : undefined}
        </div>
      </div>
    </div>
  );
}

export default function Payment() {
  const { t } = useT('payment');
  const { gateway } = useParams();
  const searchParams = useSearchParams();

  const [paymentData, setPaymentData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function verifyPayment() {
      setIsLoading(true);
      setPaymentData({});

      let paymentParams = {};
      switch (gateway.toLowerCase()) {
        case 'zarinpal':
          paymentParams = {
            gateway: 'zarinpal',
            authority: searchParams.get('Authority'),
            status: searchParams.get('Status'),
          };
          break;
        case 'zibal':
          paymentParams = {
            gateway: 'zibal',
            trackId: searchParams.get('trackId'),
            status: searchParams.get('success'),
          };
          break;
        case 'nowpayments':
          paymentParams = {
            gateway: 'nowpayments',
            payment_id: searchParams.get('payment_id'),
          };
          break;
        default:
          toast.error(
            t(`code-responses.INVALID_GATEWAY`, t('general.unknown-problem')),
          );
          setIsLoading(false);
          return;
      }

      if (
        !paymentParams.authority &&
        !paymentParams.trackId &&
        !paymentParams.payment_id
      ) {
        toast.error(
          t(
            `code-responses.MISSING_PAYMENT_IDENTIFIER`,
            t('general.unknown-problem'),
          ),
        );
        setIsLoading(false);
        return;
      }

      fetch('/api/dashboard/topup-request/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gateway,
          authority: paymentParams?.authority || undefined,
          trackId: paymentParams?.trackId || undefined,
          payment_id: paymentParams?.payment_id || undefined,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res?.ok && res?.result) {
            setPaymentData(res.result);
          } else {
            setPaymentData(res?.result || {});
            toast.error(
              t(`code-responses.${res?.message}`, res.message) ||
                t('general.unknown-problem'),
            );
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    verifyPayment();
  }, [gateway, searchParams, t]);

  return isLoading ? (
    <Placeholder />
  ) : (
    <ShowStatus t={t} paymentData={paymentData} />
  );
}
