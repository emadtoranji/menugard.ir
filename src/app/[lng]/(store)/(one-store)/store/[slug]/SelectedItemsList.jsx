'use client';

import Loading from '@components/Loading/client';
import { useOrder } from '@context/notes/order/useOrder';
import { useT } from '@i18n/client';
import { formatNumber } from '@utils/numbers';
import ItemQuantityButton from './ItemQuantityButton';
import CurrencySpan from './CurrencySpan';
import OptionQuantityButton from './OptionQuantityButton';
import ItemPrice from './ItemPrice';
import OptionPrice from './OptionPrice';
import { useParams } from 'next/navigation';
import { fallbackLng } from '@i18n/settings';

export default function SelectedItemsList() {
  const { state } = useOrder();
  const { t } = useT('store');
  const lng = useParams()?.lng || fallbackLng;

  if (state === null) return <Loading />;
  if (!state?.items?.length) return <h3>{t('order-list-empty')}</h3>;

  const currencySpan = <CurrencySpan storeCurrency={state.store.currency} />;

  return (
    <div className='container mx-auto grid grid-cols-1 gap-2'>
      {state.items.map((item, index) => {
        return (
          <div
            key={index}
            className='py-3 border-b-2  border-purple-500 text-active'
          >
            <div className='flex items-center justify-between my-auto'>
              <h4>{item.title}</h4>
              <ItemQuantityButton item={item} />
            </div>

            <ItemPrice item={item} storeCurrency={state.store.currency} />

            <div className='container mx-auto grid grid-cols-1 gap-2 pt-4'>
              {item.options.map((option) => {
                if (option.count <= 0 || !option?.isActive) return undefined;
                return (
                  <div
                    key={option.id}
                    className='my-auto border-t-2 border-purple-300 py-2'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex align-items-baseline gap-1 m-0'>
                        {option.isRequired && (
                          <i className='icon-sm bi bi-asterisk text-danger'></i>
                        )}
                        <div>{option.title}</div>
                        <OptionPrice
                          option={option}
                          storeCurrency={state.store.currency}
                        />
                      </div>
                      <OptionQuantityButton item={item} option={option} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className='mt-3 num-align'>
        <h3 className='flex items-center justify-between font-semibold'>
          <div className=''>{t('order-list-tax-title')}</div>
          <div className='flex gap-1'>
            <span>{formatNumber(state.taxPrice, lng)}</span>
            <span>{currencySpan}</span>
          </div>
        </h3>
        <h3 className='flex items-center justify-between mt-2 font-semibold'>
          <div className=''>{t('order-list-title')}</div>
          <div className='flex gap-1'>
            <span>{formatNumber(state.itemsPrice, lng)}</span>
            <span>{currencySpan}</span>
          </div>
        </h3>
        <h3 className='flex items-center justify-between mt-8 font-bold'>
          <div className=''>{t('order-list-total-price-title')}</div>
          <div className='flex gap-1 text-2xl'>
            <span>{formatNumber(state.totalPrice, lng)}</span>
            <span>{currencySpan}</span>
          </div>
        </h3>
      </div>
    </div>
  );
}
