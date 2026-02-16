'use client';

import { useT } from '@i18n/client';
import WorkingTime from './WorkingTime';

export default function ItemCategories({
  activeCategory,
  setActiveCategory,
  items = {},
}) {
  const { t } = useT('store-item-categories');

  const uniqueCategories = Array.from(
    new Set(items.map((item) => item?.category).filter(Boolean)),
  );

  return (
    <>
      <nav className='container-fluid store-categories fixed top-0 w-full'>
        <div className='flex gap-2 overflow-auto hide-scrollbar px-2'>
          <button
            type='button'
            onClick={() => setActiveCategory(null)}
            className={`text-nowrap btn btn-lg ${activeCategory === null ? 'opacity-100' : 'opacity-75'}`}
          >
            <span className='sr-only'>All Categories</span>
            <span>{t('all-categories')}</span>
          </button>

          {uniqueCategories.map((category) => (
            <button
              type='button'
              key={`item-category-${category}`}
              onClick={() => setActiveCategory(category)}
              className={`text-nowrap btn btn-lg ${activeCategory === category ? 'opacity-100 font-bold' : 'opacity-75'}`}
            >
              <span className='sr-only'>{category} Category</span>
              <span className='text-capitalize'>{t(category, category)}</span>
            </button>
          ))}
        </div>
      </nav>
      <div className='mt-12'></div>
      <WorkingTime />
    </>
  );
}
