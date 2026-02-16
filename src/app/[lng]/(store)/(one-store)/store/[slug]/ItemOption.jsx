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
            <h5 className='flex justify-center items-center gap-1 m-0 text-sm'>
              <i
                className={`icon-sm bi ${option.isRequired ? 'bi-asterisk text-danger' : 'bi-magic text-active'} text-xs`}
              ></i>
              <div>{option.title}</div>

              <OptionPrice option={option} />
            </h5>

            <OptionQuantityButton item={item} option={option} />
          </div>
        );
      })}
    </div>
  );
}
