import { formatNumber } from '@utils/numbers';
import CurrencySpan from './CurrencySpan';
import FreeSpanComponent from './FreeSpanComponent';
import { fallbackLng } from '@i18n/settings';
import { useParams } from 'next/navigation';
import Loading from '@app/loading';
import { useOrder } from '@context/notes/order/useOrder';

export default function OptionPrice({ option }) {
  const { state } = useOrder();

  if (state === null) return <Loading />;

  const lng = useParams()?.lng || fallbackLng;
  const additionalClass = 'm-auto font-semibold';
  const currencySpan = <CurrencySpan storeCurrency={state.store.currency} />;
  const freeSpan = <FreeSpanComponent additionalClass={additionalClass} />;

  return !isNaN(option.price) ? (
    option.price === 0 ? (
      <span className={additionalClass}>
        (<span>{freeSpan}</span>)
      </span>
    ) : (
      <div className={`font-semibold flex items-center ${additionalClass} `}>
        <span>(</span>
        <span className='flex items-center gap-1'>
          <span>{formatNumber(option.price, lng)}</span>
          {currencySpan}
        </span>
        <span>)</span>
      </div>
    )
  ) : null;
}
