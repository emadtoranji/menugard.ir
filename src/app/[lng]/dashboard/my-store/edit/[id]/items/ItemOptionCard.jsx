'use client';
import { useT } from '@i18n/client';
import Input from '../../../(components)/Input';
import { exportOnlyNumberFromString } from '@utils/numbers';
import { useEffect, useMemo, useState } from 'react';

export default function ItemOptionCard({ option, onChange, onDelete }) {
  const { t } = useT('dashboard-my-store');
  const [isForcedOne, setIsForcedOne] = useState(false);

  function set(field, value) {
    if (['title'].includes(field)) {
      value = value.replace(/[^\p{L}\p{N}\p{Emoji}\s]/gu, '');
    } else if (['minSelect', 'maxSelect'].includes(field)) {
      value = exportOnlyNumberFromString({ value, float: false });
      if (value < 0) {
        value = 0;
      }
    } else if (['price'].includes(field)) {
      value = exportOnlyNumberFromString({ value, float: true });
      if (value < 0) {
        value = 0;
      }
    } else if (['discountPercent'].includes(field)) {
      value = exportOnlyNumberFromString({ value, float: false });

      if (value < 0) {
        value = 0;
      } else if (value > 100) {
        value = 100;
      }
    }
    onChange({ ...option, [field]: value });
  }

  const normalizedOption = useMemo(() => {
    if (option.isRequired) {
      if (isForcedOne && (option.minSelect !== 1 || option.maxSelect !== 1)) {
        return { ...option, minSelect: 1, maxSelect: 1 };
      }
    } else {
      if (option.minSelect !== 0) {
        return { ...option, minSelect: 0 };
      }
    }
    return option;
  }, [option, isForcedOne]);

  useEffect(() => {
    if (normalizedOption !== option) {
      onChange(normalizedOption);
    }
  }, [normalizedOption, onChange, option]);

  return (
    <div className='bg-white text-black rounded p-3'>
      <div className='mt-2'>
        <h6 className='card-title'>
          {t('edit.sections.items.item-option-title')}
        </h6>
        <Input
          type='text'
          name='title'
          value={option.title}
          HandleChange={set}
          label={t('edit.sections.items.item-option-title')}
          disabled={false}
          hasValidValue={
            typeof option.title === 'string' &&
            option.title.length > 0 &&
            option.title.length <= 60 &&
            !/[^\p{L}\p{N}\p{Emoji}\s]/gu.test(option.title)
          }
          isRtl={!/^[a-zA-Z]/.test(option.title)}
          min={1}
          max={60}
        />
      </div>

      <div className='my-3'>
        <h6 className='card-title'>
          {t('edit.sections.items.item-option-required-title')}
        </h6>
        <div className='flex gap-2'>
          <button
            className={`btn btn-sm w-full ${option.isRequired ? 'btn-active' : 'btn-inactive'}`}
            onClick={() => set('isRequired', true)}
          >
            {t('edit.sections.items.required')}
          </button>
          <button
            className={`btn btn-sm w-full ${!option.isRequired ? 'btn-active' : 'btn-inactive'}`}
            onClick={() => set('isRequired', false)}
          >
            {t('edit.sections.items.optional')}
          </button>
        </div>
      </div>

      <div className='my-3'>
        <h6 className='card-title'>
          {t('edit.sections.items.item-option-count-title')}
        </h6>
        <div className='grid grid-cols-2 gap-2'>
          <button
            onClick={() => setIsForcedOne(true)}
            className={`btn btn-sm btn-${isForcedOne ? 'active' : 'inactive'} w-full mb-1`}
          >
            {t('edit.sections.items.item-option-count-one')}
          </button>
          <button
            onClick={() => setIsForcedOne(false)}
            className={`btn btn-sm btn-${isForcedOne ? 'inactive' : 'active'} col`}
          >
            {t('edit.sections.items.item-option-count-multi')}
          </button>
        </div>

        <div className='mt-3 grid grid-cols-2 gap-3'>
          <div>
            <h6 className='card-title'>
              {t('edit.sections.items.item-option-minimum')}
            </h6>
            <Input
              type='numeric'
              name='minSelect'
              value={option.minSelect}
              HandleChange={set}
              label={t('edit.sections.items.item-option-minimum')}
              disabled={!option.isRequired || isForcedOne}
              hasValidValue={
                option.isRequired
                  ? option.minSelect >= 1
                  : option.minSelect >= 0
              }
              isRtl={false}
              min={option.isRequired ? 1 : 0}
              max={undefined}
            />
          </div>
          <div>
            <h6 className='card-title'>
              {t('edit.sections.items.item-option-maximum')}
            </h6>
            <Input
              type='numeric'
              name='maxSelect'
              value={option.maxSelect}
              HandleChange={set}
              label={t('edit.sections.items.item-option-maximum')}
              disabled={isForcedOne}
              hasValidValue={
                option.maxSelect >= 0 && option.minSelect <= option.maxSelect
              }
              isRtl={false}
              min={1}
              max={undefined}
            />
          </div>
        </div>
      </div>

      <div className='mt-3 grid grid-cols-2 gap-3'>
        <div>
          <h6 className='card-title'>
            {t('edit.sections.items.item-option-price')}
          </h6>
          <Input
            type='numeric'
            name='price'
            value={option.price}
            HandleChange={set}
            label={t('edit.sections.items.item-option-price')}
            disabled={false}
            hasValidValue={option.price >= 0}
            isRtl={false}
            min={0}
            max={undefined}
          />
        </div>
        <div>
          <h6 className='card-title'>
            {t('edit.sections.items.item-option-discount-percent')}
          </h6>
          <Input
            type='numeric'
            name='discountPercent'
            value={option.discountPercent}
            HandleChange={set}
            label={t('edit.sections.items.item-option-discount-percent')}
            disabled={false}
            hasValidValue={option.price >= 0 || option.price <= 100}
            isRtl={false}
            min={0}
            max={100}
          />
        </div>
      </div>

      <div className='my-3'>
        <h6 className='card-title'>
          {t('edit.sections.items.item-option-enable-title')}
        </h6>
        <div className='flex gap-2'>
          <button
            className={`btn w-full ${option.isActive ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => set('isActive', true)}
          >
            {t('edit.sections.items.active')}
          </button>
          <button
            className={`btn w-full ${!option.isActive ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => set('isActive', false)}
          >
            {t('edit.sections.items.deactive')}
          </button>
        </div>
      </div>

      <button className='btn btn-danger w-full mt-5 pt-5' onClick={onDelete}>
        {t('edit.sections.items.option-delete')}
      </button>
    </div>
  );
}
