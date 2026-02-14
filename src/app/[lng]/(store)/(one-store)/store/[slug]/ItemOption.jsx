'use client';

import { useOrder } from '@context/notes/order/useOrder';
import Loading from '@components/Loading/client';
import OptionQuantityButton from './OptionQuantityButton';
import OptionPrice from './OptionPrice';

export default function ItemOption({ options = [], item = null }) {
  const { state } = useOrder();

  if (state === null) return <Loading />;

  const itemId = item.id;
  if (!options.length) return null;

  const orderItem = (state?.items || []).find((i) => i.id === itemId);
  const optionCounts = {};
  orderItem?.options?.forEach((o) => {
    optionCounts[o.id] = o.count ?? o.minSelect ?? 0;
  });

  const currentOptions = orderItem?.options || [];

  if (!currentOptions.length) return;

  return (
    <div className='border-t border-muted mt-2 pt-2 w-full grid grid-cols-1 gap-1 px-1'>
      {currentOptions.map((option) => {
        if (!option?.title) return null;
        const optionId = option.id;

        return (
          <div
            key={`item-option-${optionId}`}
            className='flex items-center justify-between'
          >
            <h4 className='flex items-baseline gap-1 m-0'>
              {option.isRequired && (
                <i className='flex items-center p-1 icon-sm bi bi-asterisk text-danger'></i>
              )}
              <div>{option.title}</div>

              <OptionPrice option={option} />
            </h4>

            <OptionQuantityButton item={item} option={option} />
          </div>
        );
      })}
    </div>
  );
}
