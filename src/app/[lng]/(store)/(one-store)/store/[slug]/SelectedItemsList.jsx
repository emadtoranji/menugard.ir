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

export default function SelectedItemsList({ storeCurrency }) {
  const { state } = useOrder();
  const { t } = useT('store');
  const lng = useParams()?.lng || fallbackLng;

  if (state === null) return <Loading />;
  if (!state?.items?.length) return <h3>{t('order-list-empty')}</h3>;

  const currencySpan = <CurrencySpan storeCurrency={storeCurrency} />;

  return (
    <div className='container-lg mx-auto row row-cols-1 g-2'>
      {state.items.map((item, index) => {
        return (
          <div key={index} className='py-3 border-bottom border-3 text-active'>
            <div className='d-flex align-items-center justify-content-between my-auto'>
              <h4>{item.title}</h4>
              <ItemQuantityButton item={item} />
            </div>

            <ItemPrice item={item} storeCurrency={storeCurrency} />

            <div className='container mx-auto row row-cols-1 g-2 mt-2'>
              {item.options.map((option) => {
                if (option.count <= 0 || !option?.isActive) return undefined;
                return (
                  <div key={option.id} className='my-auto border-top py-2'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <div className='d-flex align-items-baseline gap-1 m-0'>
                        {option.isRequired && (
                          <i className='d-flex align-items-center fs-11 bi bi-asterisk text-danger'></i>
                        )}
                        <div>{option.title}</div>
                        <OptionPrice
                          option={option}
                          storeCurrency={storeCurrency}
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
        <div className='d-flex align-items-center justify-content-between h5'>
          <div>{t('order-list-tax-title')}</div>
          <div className='d-flex gap-1'>
            <span>{formatNumber(state.taxPrice, lng)}</span>
            <span>{currencySpan}</span>
          </div>
        </div>
        <div className='d-flex align-items-center justify-content-between mt-2 h5'>
          <div>{t('order-list-title')}</div>
          <div className='d-flex gap-1'>
            <span>{formatNumber(state.itemsPrice, lng)}</span>
            <span>{currencySpan}</span>
          </div>
        </div>
        <div className='d-flex align-items-center justify-content-between mt-4 h4'>
          <div>{t('order-list-total-price-title')}</div>
          <div className='d-flex gap-1'>
            <span>{formatNumber(state.totalPrice, lng)}</span>
            <span>{currencySpan}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
