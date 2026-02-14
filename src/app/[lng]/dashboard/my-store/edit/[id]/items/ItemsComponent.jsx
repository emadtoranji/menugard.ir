'use client';

import { useState } from 'react';
import StoreItemCard from './StoreItemCard';
import { useT } from '@i18n/client';

export default function ItemsComponent({ StoreItemsCategoriesKey, store }) {
  const { t } = useT('dashboard-my-store');
  const [items, setItems] = useState(store.items || []);
  const [activeItemId, setActiveItemId] = useState(null);
  const [newItem, setNewItem] = useState(null);

  function startNewItem() {
    setActiveItemId(null);
    setNewItem({
      id: null,
      storeId: store.id,
      category: null,
      title: '',
      description: '',
      price: 0,
      discountPercent: 0,
      imageUrl: null,
      isAvailable: true,
      isActive: true,
      options: [],
    });
  }

  function saveNewItem(data) {
    const savedItem = { ...data, id: 'new' };
    setItems((prev) => [...prev, savedItem]);
    setNewItem(null);
    setActiveItemId(savedItem.id);
  }

  function cancelNewItem() {
    setNewItem(null);
  }

  function updateItem(id, updatedItem) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...updatedItem, id } : item)),
    );
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setActiveItemId(null);
  }

  return (
    <div className='container-fluid px-0'>
      <div className='container mb-8'>
        <div className='w-full mb-3'>
          <button
            className={`btn btn-lg font-semibold btn-${newItem ? 'active' : 'inactive'} w-full`}
            onClick={newItem ? undefined : startNewItem}
          >
            {t('edit.sections.items.add-item')}
          </button>
        </div>

        <div className='px-2'>
          <div className='flex gap-2 mt-5'>
            {items.map((item) => (
              <button
                key={item.id}
                type='button'
                className={`btn ${
                  activeItemId === item.id ? 'btn-active' : 'btn-inactive'
                }`}
                onClick={() => {
                  setNewItem(null);
                  setActiveItemId(item.id);
                }}
              >
                {item.title || 'Item'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {newItem ? (
        <StoreItemCard
          storeId={store.id}
          StoreItemsCategoriesKey={StoreItemsCategoriesKey}
          item={newItem}
          onSave={saveNewItem}
          onDelete={cancelNewItem}
        />
      ) : undefined}
      {activeItemId ? (
        <StoreItemCard
          key={activeItemId}
          storeId={store.id}
          StoreItemsCategoriesKey={StoreItemsCategoriesKey}
          item={items.find((item) => item.id === activeItemId)}
          onSave={(data) => updateItem(activeItemId, data)}
          onDelete={() => removeItem(activeItemId)}
        />
      ) : undefined}
    </div>
  );
}
