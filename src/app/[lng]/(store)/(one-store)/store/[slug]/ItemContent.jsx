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
        className='position-fixed bottom-0 end-0 mx-4 mb-4 rounded'
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

      <div className='row g-1 g-lg-2'>
        {(items || []).map((item) => {
          const isOrderable = item?.isAvailable && item?.isActive;

          return (
            <div
              key={`item-${item.id}`}
              style={{ minHeight: '250px' }}
              className={`col-12 col-lg-6 col-xxl-4 d-flex ${
                isOrderable ? '' : 'opacity-75'
              }`}
            >
              <div className='card border-0 shadow flex-fill bg-white'>
                <div className='card-body d-flex gap-3'>
                  <div className='col'>
                    <h4 className='fw-bold'>{item.title}</h4>
                    <p className='text-justify px-1'>{item.description}</p>
                  </div>
                  <div className='col-auto d-flex align-items-center justify-content-center'>
                    <ItemImage
                      key={`logo-${item.category}`}
                      category={item.category}
                      title={item.title}
                      defaultImage={defaultImage}
                    />
                  </div>
                </div>

                <div className='card-footer bg-white'>
                  <div className='d-flex align-items-center justify-content-between py-1'>
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
