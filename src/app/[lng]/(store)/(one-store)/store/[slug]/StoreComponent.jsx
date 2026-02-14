'use client';

import { useMemo, useState } from 'react';
import ItemCategories from './ItemCategories';
import ItemContent from './ItemContent';
import StoreIntro from './StoreIntro';
import { OrderProvider } from '@context/notes/order/context';
import Loading from '@app/loading';
import { OffcanvasButton, OffcanvasWrapper } from '@components/Offcanvas';
import SelectedItemsList from './SelectedItemsList';
import { useT } from '@i18n/client';

export default function StoreComponent({ store }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const { t } = useT('store');
  const defaultLogoUrl = '/images/app-logo.webp';
  if (!store) return <Loading />;

  const filteredItems = useMemo(() => {
    return Object.values(
      store.items
        .filter((f) => activeCategory === null || f.category === activeCategory)
        .reduce((acc, item) => {
          const cat = item.category;
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(item);
          return acc;
        }, {}),
    ).flatMap((categoryItems) =>
      categoryItems.sort((a, b) => {
        const aInactive = !a.isActive || !a.isAvailable;
        const bInactive = !b.isActive || !b.isAvailable;
        if (aInactive && !bInactive) return 1;
        if (!aInactive && bInactive) return -1;
        return 0;
      }),
    );
  }, [store.items, activeCategory]);

  return (
    <OrderProvider store={store}>
      <div
        className={`fixed bottom-0 right-0 mx-8 mb-8 rounded `}
        style={{ zIndex: 'var(--zindex-offcanvas)' }}
      >
        <OffcanvasButton
          showCanvas={showCanvas}
          setShowCanvas={setShowCanvas}
          btnTitle={t('order-list-button')}
          btnClass='btn-active btn-lg shadow-lg'
        />
      </div>

      <OffcanvasWrapper
        showCanvas={showCanvas}
        setShowCanvas={setShowCanvas}
        title={t('order-list-title')}
        zIndex={'calc(var(--zindex-offcanvas) + var(--zindex-nav))'}
      >
        <SelectedItemsList />
      </OffcanvasWrapper>

      <div className={`${showCanvas ? 'hidden' : ''}`}>
        <ItemCategories
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          items={store.items}
        />
        <StoreIntro
          name={store.name}
          logoUrl={store?.logoUrl || defaultLogoUrl}
        />
        <ItemContent
          items={filteredItems}
          defaultImage={store?.logoUrl || defaultLogoUrl}
        />
        <p className='text-center italic mt-8 mb-10'>{store.description}</p>
      </div>
    </OrderProvider>
  );
}
