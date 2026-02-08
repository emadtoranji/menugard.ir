import { formatNumber } from '@utils/numbers';
import CurrencySpan from './CurrencySpan';
import FreeSpanComponent from './FreeSpanComponent';
import { fallbackLng } from '@i18n/settings';
import { useParams } from 'next/navigation';

export default function OptionPrice({ option, storeCurrency }) {
  const lng = useParams()?.lng || fallbackLng;
  const additionalClass = 'm-auto fs-7 fw-bolder';
  const currencySpan = <CurrencySpan storeCurrency={storeCurrency} />;
  const freeSpan = <FreeSpanComponent additionalClass={additionalClass} />;

  return !isNaN(option.price) ? (
    option.price === 0 ? (
      <span className={additionalClass}>
        (<span>{freeSpan}</span>)
      </span>
    ) : (
      <div className={`d-flex align-items-center ${additionalClass} `}>
        <span>(</span>
        <span className='d-flex align-items-center gap-1'>
          <span>{formatNumber(option.price, lng)}</span>
          {currencySpan}
        </span>
        <span>)</span>
      </div>
    )
  ) : null;
}
