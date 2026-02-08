import FreeSpanComponent from './FreeSpanComponent';
import { formatNumber } from '@utils/numbers';
import CurrencySpan from './CurrencySpan';
import { useParams } from 'next/navigation';
import { fallbackLng } from '@i18n/settings';

export default function ItemPrice({ item, storeCurrency }) {
  const lng = useParams()?.lng || fallbackLng;
  const freeSpan = <FreeSpanComponent additionalClass={'text-success small'} />;
  const currencySpan = <CurrencySpan storeCurrency={storeCurrency} />;
  const discontedPrice = item.price - (item.price * item.discountPercent) / 100;

  return (
    <div>
      <h6
        className={`m-auto d-flex align-items-center gap-1 mt-3 mb-1 ${
          item.price > 0 && item.discountPercent
            ? 'text-decoration-line-through fs-6 fw-light'
            : 'fs-5 fw-bold'
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
      </h6>

      {item.discountPercent ? (
        <h6 className='fw-bold fs-5 m-auto d-flex align-items-center gap-1'>
          {discontedPrice === 0 ? (
            freeSpan
          ) : (
            <>
              <span>{formatNumber(discontedPrice, lng)}</span>
              {currencySpan}
            </>
          )}
        </h6>
      ) : null}
    </div>
  );
}
