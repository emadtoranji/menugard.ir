import { formatNumber } from '@utils/numbers';
import CurrencySpan from './CurrencySpan';
import FreeSpanComponent from './FreeSpanComponent';
import { useT } from '@i18n/client';

export default function OptionPrice({ option, storeCurrency }) {
  const { i18n } = useT('store');
  const lng = i18n.language;
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
