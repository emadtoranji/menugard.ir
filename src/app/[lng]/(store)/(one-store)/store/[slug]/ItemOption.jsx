'use client';

import { useT } from '@i18n/client';
import { freeSpanComponent } from './FreeSpan';
import { formatNumber } from '@utils/numbers';
import { useOrder } from '@context/notes/order/useOrder';
import Loading from '@components/Loading/client';
import OptionQuantityButton from './OptionQuantityButton';

export default function ItemOption({ lng, options = [], item = null }) {
  const { t } = useT('store');
  const { state } = useOrder();

  if (state === null) return <Loading />;

  const itemId = item.id;
  if (!options.length) return null;

  const additionalClass = 'm-auto fs-7';
  const freeSpan = freeSpanComponent({ t, additionalClass });

  const orderItem = (state?.items || []).find((i) => i.id === itemId);
  const optionCounts = {};
  orderItem?.options?.forEach((o) => {
    optionCounts[o.id] = o.count ?? o.minSelect ?? 0;
  });

  const currentOptions = orderItem?.options || [];

  return (
    <div className='border-top mt-2 pt-2 w-100 row row-cols-1 g-1 px-1'>
      {currentOptions.map((option) => {
        if (!option?.title) return null;
        const optionId = option.id;

        const priceSection = !isNaN(option.priceChangePercent) ? (
          option.priceChangePercent === 0 ? (
            <span className={additionalClass}>
              (<span>{freeSpan}</span>)
            </span>
          ) : (
            <bdi dir='ltr' className={`${additionalClass} fw-bolder`}>
              ({option.priceChangePercent > 0 ? '+' : ''}
              {formatNumber(option.priceChangePercent, lng)}
              {t('general.percent')})
            </bdi>
          )
        ) : null;

        return (
          <div
            key={`item-option-${optionId}`}
            className='d-flex align-items-center justify-content-between'
          >
            <h6 className='d-flex align-items-baseline gap-1 m-0'>
              {option.isRequired && (
                <i className='d-flex align-items-center fs-10 bi bi-asterisk text-danger'></i>
              )}
              <span>{option.title}</span>
              {priceSection}
            </h6>

            <OptionQuantityButton item={item} lng={lng} option={option} />
          </div>
        );
      })}
    </div>
  );
}
