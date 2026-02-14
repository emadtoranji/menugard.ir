'use client';

import Loading from '@components/Loading/client';
import { useOrder } from '@context/notes/order/useOrder';
import { useT } from '@i18n/client';
import toast from 'react-hot-toast';

export default function ItemQuantityButton({ item = {} }) {
  const { t } = useT('store');
  const { state, addItem, updateItem, removeItem } = useOrder();
  if (state === null) return <Loading />;

  const isOrderable = item?.isAvailable && item?.isActive;

  const orderItem = (state?.items || []).find((i) => i.id === item.id);
  const quantity = orderItem?.quantity || 0;

  function handleAddItem(item) {
    const existingItem = (state?.items || []).find((i) => i.id === item.id);
    if (!item?.isActive) {
      toast.error(t('is-not-active'));
    } else if (!item?.isAvailable) {
      toast.error(t('is-not-avaialbe'));
    } else {
      if (existingItem) {
        updateItem({
          ...existingItem,
          quantity: (existingItem.quantity || 1) + 1,
        });
      } else {
        const newItem = {
          ...item,
          quantity: 1,
          options: (item.options || [])
            .filter((of) => of?.isActive)
            .map((o) => ({
              ...o,
              count: o.minSelect || 0,
            })),
        };
        addItem(newItem);
      }
    }
  }

  function handleRemoveItem(item) {
    const existingItem = (state?.items || []).find((i) => i.id === item.id);
    if (!existingItem) return;

    if ((existingItem.quantity || 1) > 1) {
      updateItem({ ...existingItem, quantity: existingItem.quantity - 1 });
    } else {
      removeItem(item.id);
    }
  }

  return quantity === 0 ? (
    <button
      type='button'
      className={`btn ${!isOrderable ? 'btn-danger  btn-sm' : 'btn-active p-2'}`}
      disabled={!isOrderable}
      onClick={() => handleAddItem(item)}
    >
      <span className='flex items-center gap-1'>
        <span className='sr-only'>Add Item</span>
        {isOrderable ? (
          <>
            <i className='p-1 icon-sm bi bi-plus-lg'></i>
            <span className='hidden'>{t('add-item')}</span>
          </>
        ) : (
          t('is-not-active')
        )}
      </span>
    </button>
  ) : (
    <div className='flex items-center gap-1'>
      <button
        type='button'
        className={`btn btn-active p-2`}
        onClick={() => handleAddItem(item)}
        disabled={!isOrderable}
      >
        <span className='sr-only'>Add Item</span>
        <i className='p-1 icon-sm bi bi-plus-lg'></i>
      </button>
      <span className='px-2 font-bold'>{quantity}</span>
      <button
        type='button'
        className='btn btn-danger p-2'
        onClick={() => handleRemoveItem(item)}
      >
        <span className='sr-only'>Remove Item</span>
        <i
          className={`p-1 icon-sm bi ${quantity === 1 ? 'bi-trash3' : 'bi-dash-lg'}`}
        ></i>
      </button>
    </div>
  );
}
