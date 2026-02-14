'use client';

import ItemOption from './ItemOption';
import { useOrder } from '@context/notes/order/useOrder';
import Loading from '@components/Loading/client';
import ItemQuantityButton from './ItemQuantityButton';
import ItemPrice from './ItemPrice';
import ItemImage from '@components/ItemImage';
import AnimatedPage from '@components/AnimatedPage';

export default function ItemContent({ items = [], defaultImage }) {
  const { state } = useOrder();

  if (state === null) return <Loading />;

  return (
    <AnimatedPage>
      <div className={`container-fluid`}>
        <div className='container grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-1 lg:gap-2 3xl:gap-3 transition-opacity duration-300'>
          {(items || []).map((item) => {
            const isOrderable = item?.isAvailable && item?.isActive;

            return (
              <div
                key={`item-${item.id}`}
                style={{ minHeight: '250px' }}
                className={`card bg-white w-full ${isOrderable ? '' : 'opacity-75'}`}
              >
                <div className='card-body flex gap-3'>
                  <div className='w-full'>
                    <h3 className='font-bold'>{item.title}</h3>
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

                <div className='border-t border-muted bg-white'>
                  <div className='flex items-center justify-between py-1 mt-2'>
                    <ItemPrice item={item} />

                    <ItemQuantityButton item={item} isOrderable={isOrderable} />
                  </div>

                  <ItemOption item={item} options={item?.options || []} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedPage>
  );
}
