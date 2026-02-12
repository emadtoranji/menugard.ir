'use client';

import { useT } from '@i18n/client';
import Image from 'next/image';
import ItemOption from './ItemOption';
import { useOrder } from '@context/notes/order/useOrder';
import Loading from '@components/Loading/client';
import { OffcanvasButton, OffcanvasWrapper } from '@components/Offcanvas';
import SelectedItemsList from './SelectedItemsList';
import ItemQuantityButton from './ItemQuantityButton';
import ItemPrice from './ItemPrice';
import { useState } from 'react';
import ItemImage from '@components/ItemImage';

export default function ItemContent({
  items = [],
  storeCurrency,
  defaultImage,
}) {
  const { t } = useT('store');
  const { state } = useOrder();

  if (state === null) return <Loading />;

  return (
    <div className='container-fluid'>
      <div
        className='position-fixed bottom-0 end-0 mx-8 mb-8 rounded'
        style={{ zIndex: 'var(--zindex-offcanvas)' }}
      >
        <OffcanvasButton
          id='offcanvasNotes'
          btnTitle={t('order-list-button')}
          btnClass='btn-active btn-lg shadow-lg'
        />
      </div>

      <OffcanvasWrapper
        id={'offcanvasNotes'}
        title={t('order-list-title')}
        zIndex={'calc(var(--zindex-offcanvas) + 10)'}
      >
        <SelectedItemsList storeCurrency={storeCurrency} />
      </OffcanvasWrapper>

      <div className='grid gap-1 gap-lg-2'>
        {(items || []).map((item) => {
          const isOrderable = item?.isAvailable && item?.isActive;

          return (
            <div
              key={`item-${item.id}`}
              style={{ minHeight: '250px' }}
              className={`w-full lg:w-1/2 2xl:w-1/3 flex ${
                isOrderable ? '' : 'opacity-75'
              }`}
            >
              <div className='card border-0 shadow flex-fill bg-white'>
                <div className='card-body flex gap-3'>
                  <div className='w-full'>
                    <h4 className='font-bold'>{item.title}</h4>
                    <p className='text-justify px-1'>{item.description}</p>
                  </div>
                  <div className='w-auto flex items-center justify-center'>
                    <ItemImage
                      key={`logo-${item.category}`}
                      category={item.category}
                      title={item.title}
                      defaultImage={defaultImage}
                    />
                  </div>
                </div>

                <div className='card-footer bg-white'>
                  <div className='flex items-center justify-between py-1'>
                    <ItemPrice item={item} storeCurrency={storeCurrency} />

                    <ItemQuantityButton
                      item={item}
                      isOrderable={isOrderable}
                      storeCurrency={storeCurrency}
                    />
                  </div>

                  <ItemOption
                    item={item}
                    options={item?.options || []}
                    storeCurrency={storeCurrency}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
