import FreeSpanComponent from './FreeSpanComponent';
import { formatNumber } from '@utils/numbers';
import CurrencySpan from './CurrencySpan';
import { useParams } from 'next/navigation';
import { fallbackLng } from '@i18n/settings';
import Loading from '@app/loading';
import { useOrder } from '@context/notes/order/useOrder';

export default function ItemPrice({ item }) {
  const { state } = useOrder();

  if (state === null) return <Loading />;

  const lng = useParams()?.lng || fallbackLng;
  const freeSpan = <FreeSpanComponent additionalClass={'text-success'} />;
  const currencySpan = <CurrencySpan storeCurrency={state.store.currency} />;
  const discontedPrice = item.price - (item.price * item.discountPercent) / 100;

  return (
    <div className='font-bold'>
      <h3
        className={`flex items-center gap-1 ${
          item.price > 0 && item.discountPercent ? 'line-through' : ''
        }`}
      >
        {item.price === 0 ? (
          freeSpan
        ) : (
          <>
            <span>{formatNumber(item.price, lng)}</span>
            {currencySpan}
          </>
        )}
      </h3>

      {item.discountPercent ? (
        <h3 className='flex items-center gap-1 px-2'>
          {discontedPrice === 0 ? (
            freeSpan
          ) : (
            <>
              <span>{formatNumber(discontedPrice, lng)}</span>
              {currencySpan}
            </>
          )}
        </h3>
      ) : null}
    </div>
  );
}
