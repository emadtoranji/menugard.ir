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
      <div className='container-fluid store-categories fixed-top'>
        <div className='d-flex gap-2 overflow-auto hide-scrollbar px-2'>
          <button
            type='button'
            onClick={() => setActiveCategory(null)}
            style={{ color: 'inherit' }}
            className={`text-nowrap btn btn-lg ${activeCategory === null ? 'opacity-100' : 'opacity-75'}`}
          >
            <span className='visually-hidden'>All</span>
            <span>{t('all-categories')}</span>
          </button>

          {uniqueCategories.map((category) => (
            <button
              type='button'
              key={`item-category-${category}`}
              onClick={() => setActiveCategory(category)}
              style={{ color: 'inherit' }}
              className={`text-nowrap btn btn-lg ${activeCategory === category ? 'opacity-100 fw-bold' : 'opacity-75'}`}
            >
              <span className='visually-hidden'>{category}</span>
              <span className='text-capitalize'>{t(category, category)}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '4rem' }}></div>
      <WorkingTime />
    </>
  );
}
