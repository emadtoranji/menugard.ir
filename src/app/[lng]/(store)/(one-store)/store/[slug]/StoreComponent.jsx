'use client';

import { useState } from 'react';
import ItemCategories from './ItemCategories';
import ItemContent from './ItemContent';
import StoreIntro from './StoreIntro';

export default function StoreComponent({ store, lng }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const defaultLogoUrl = '/images/app-logo.webp';

  return (
    <>
      <ItemCategories
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        items={store.items}
      />

      <div style={{ marginTop: '4rem' }}></div>

      <StoreIntro
        name={store.name}
        logoUrl={store?.logoUrl || defaultLogoUrl}
      />

      <ItemContent
        key={activeCategory}
        storeCurrency={store.currency}
        items={Object.values(
          store.items
            .filter(
              (f) => activeCategory === null || f.category === activeCategory,
            )
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
        )}
        defaultImage={store?.logoUrl || defaultLogoUrl}
      />

      <div className='text-center text-justify mt-5'>{store.description}</div>
    </>
  );
}
