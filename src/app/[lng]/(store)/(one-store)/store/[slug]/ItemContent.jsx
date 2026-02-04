'use client';

import { useT } from '@i18n/client';
import { formatNumber } from '@utils/numbers';
import Image from 'next/image';
import ItemOption from './ItemOption';
import { freeSpanComponent } from './FreeSpan';
import { useOrder } from '@context/notes/order/useOrder';
import Loading from '@components/Loading/client';
import { OffcanvasButton, OffcanvasWrapper } from '@components/Offcanvas';
import SelectedItemsList from './SelectedItemsList';
import ItemQuantityButton from './ItemQuantityButton';
import CurrencySpan from './CurrencySpan';

export default function ItemContent({
  items = [],
  storeCurrency,
  defaultImage,
}) {
  const { t, i18n } = useT('store');
  const { state } = useOrder();

  if (state === null) return <Loading />;

  const lng = i18n.language;
  const freeSpan = freeSpanComponent({ t });
  const currencySpan = <CurrencySpan t={t} storeCurrency={storeCurrency} />;

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
        <SelectedItemsList lng={lng} storeCurrency={storeCurrency} />
      </OffcanvasWrapper>

      <div className='row g-1 g-lg-2'>
        {(items || []).map((item) => {
          const discontedPrice =
            item.price - (item.price * item.discountPercent) / 100;
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
                <div className='card-body d-flex'>
                  <div className='col px-1'>
                    <h4 className='fw-bold'>{item.title}</h4>
                    <p className='text-justify px-1'>{item.description}</p>
                  </div>
                  <div className='col-auto d-flex align-items-center justify-content-center'>
                    <Image
                      className='rounded'
                      src={item?.imageUrl || defaultImage}
                      alt={item.title}
                      width={100}
                      height={100}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </div>

                <div className='card-footer bg-white'>
                  <div className='d-flex align-items-center justify-content-between'>
                    <div className=''>
                      <h6
                        className={`m-auto d-flex align-items-center gap-1 ${
                          item.price > 0 && item.discountPercent
                            ? 'text-decoration-line-through fs-7 fw-light'
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

                    <ItemQuantityButton
                      item={item}
                      isOrderable={isOrderable}
                      storeCurrency={storeCurrency}
                    />
                  </div>

                  <ItemOption
                    lng={lng}
                    item={item}
                    options={item?.options || []}
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
