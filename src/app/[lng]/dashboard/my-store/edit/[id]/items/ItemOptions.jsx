'use client';

import ItemOptionCard from './ItemOptionCard';
import { useT } from '@i18n/client';

export default function ItemOptions({ options, onChange }) {
  if (!Array.isArray(options)) {
    options = [];
  }
  const { t } = useT('dashboard-my-store');
  function addOption() {
    onChange([
      ...options,
      {
        id: null,
        title: '',
        isRequired: false,
        minSelect: 0,
        maxSelect: 1,
        price: 0,
        discountPercent: 0,
        isActive: true,
      },
    ]);
  }

  function update(index, option) {
    const copy = [...options];
    copy[index] = option;
    onChange(copy);
  }

  function remove(index) {
    onChange(options.filter((_, i) => i !== index));
  }

  return (
    <div className='w-full text-bg-dark rounded px-3 py-8'>
      <strong>{t('edit.sections.items.options-title')}</strong>

      <ul className='list-group list-group-flush bg-dark fst-italic small px-0 py-2'>
        {t('edit.sections.items.options-samples-idea', {
          returnObjects: true,
        }).map((idea, index) => {
          if (idea)
            return (
              <li
                key={`option-sample-idea-${index}`}
                className='list-group-item text-bg-dark'
              >
                {idea}
              </li>
            );
        })}
      </ul>

      <button className='btn btn-active w-full my-2' onClick={addOption}>
        {t('edit.sections.items.option-new')}
      </button>

      <div className='my-2'>
        <div className='grid grid-cols-1 grid-cols-xl-2 gap-2'>
          {options.map((opt, i) => (
            <div className='w-full' key={opt.id ?? i}>
              <ItemOptionCard
                option={opt}
                onChange={(o) => update(i, o)}
                onDelete={() => remove(i)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
