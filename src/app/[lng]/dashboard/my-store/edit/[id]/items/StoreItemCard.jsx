'use client';

import { useState } from 'react';
import ItemOptions from './ItemOptions';
import { useT } from '@i18n/client';
import Spinner from '@components/Spinner';
import toast from 'react-hot-toast';
import Input from '../../../(components)/Input';
import { exportOnlyNumberFromString } from '@utils/numbers';
import { requestDeleteItem, requestSubmit } from './Request';

export default function StoreItemCard({
  storeId,
  StoreItemsCategoriesKey,
  item,
  onSave,
  onDelete,
}) {
  const { t } = useT('dashboard-my-store');
  const { t: tItemCategories } = useT('store-item-categories');
  const [data, setData] = useState(item);
  const [loading, setLoading] = useState(false);
  const [isSureForDelete, setIsSureForDelete] = useState(false);

  function set(field, value) {
    if (['title', 'description'].includes(field)) {
      value = value.replace(/[^\p{L}\p{N}\p{Emoji}\s]/gu, '');
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

    setData((prev) => ({ ...prev, [field]: value }));
  }

  async function submit() {
    setLoading(true);
    const res = await requestSubmit({ data, storeId });
    if (res.ok) {
      toast.success(t(`edit.updated-successfully`));
      onSave({ ...data, id: res.result.itemId });
    } else {
      toast.error(
        t(`code-responses.${res.message}`, t('general.unknown-problem')),
      );
    }
    setLoading(false);
  }

  async function deleteItem() {
    if (!data.id) {
      toast.error(t('general.unknown-problem'));
      return;
    }
    setLoading(true);
    const res = await requestDeleteItem({ storeId: data.id });
    if (res.ok) {
      toast.success(t(`edit.deleted-successfully`));
      onDelete();
    } else {
      toast.error(
        t(`code-responses.${res.message}`, t('general.unknown-problem')),
      );
    }
    setLoading(false);
  }

  return (
    <div className='card h-full'>
      <div className='card-body flex flex-col gap-3'>
        <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-3 xl:gap-4'>
          <div className=''>
            <h6 className='card-title'>
              {t('edit.sections.items.item-title')}
            </h6>
            <Input
              type='text'
              name='title'
              value={data.title}
              HandleChange={set}
              label={t('edit.sections.items.item-title')}
              disabled={false}
              hasValidValue={
                typeof data.title === 'string' &&
                data.title.length > 0 &&
                data.title.length <= 60 &&
                !/[^\p{L}\p{N}\p{Emoji}\s]/gu.test(data.title)
              }
              isRtl={!/^[a-zA-Z]/.test(data.title)}
              min={1}
              max={60}
            />
          </div>

          <div className=''>
            <h6 className='card-title'>
              {t('edit.sections.items.item-description')}
            </h6>
            <Input
              type='textarea'
              name='description'
              value={data.description}
              HandleChange={set}
              label={t('edit.sections.items.item-description')}
              disabled={false}
              hasValidValue={
                typeof data.description === 'string' &&
                data.description.length > 0 &&
                data.description.length <= 200 &&
                !/[^\p{L}\p{N}\p{Emoji}\s]/gu.test(data.description)
              }
              isRtl={!/^[a-zA-Z]/.test(data.description)}
              min={1}
              max={200}
            />
          </div>
        </div>

        <div className='w-full pt-6 mt-6'>
          <h6 className='card-title'>
            {t(`edit.sections.items.item-category-title`)}
          </h6>
          <div className='flex flex-wrap gap-2'>
            {StoreItemsCategoriesKey.map((itemCategory) => {
              return (
                <button
                  key={`item-category-${itemCategory}`}
                  className={`w-auto btn text-nowrap ${data.category === itemCategory ? 'btn-active' : 'btn-inactive'}`}
                  onClick={() => set('category', itemCategory)}
                >
                  <span className='text-capitalize'>
                    {tItemCategories(itemCategory, itemCategory)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className='grid grid-cols-2 w-full gap-3 xl:gap-4 py-6 my-6 border-y border-stone-400'>
          <div>
            <h6 className='card-title'>
              {t('edit.sections.items.item-price')}
            </h6>
            <Input
              type='numeric'
              name='price'
              value={data.price}
              HandleChange={set}
              label={t('edit.sections.items.item-price')}
              disabled={false}
              hasValidValue={data.price >= 0}
              isRtl={false}
              min={0}
              max={undefined}
            />
          </div>
          <div>
            <h6 className='card-title'>
              {t('edit.sections.items.item-discount-percnet')}
            </h6>
            <Input
              type='numeric'
              name='discountPercent'
              value={data.discountPercent}
              HandleChange={set}
              label={t('edit.sections.items.item-discount-percnet')}
              disabled={false}
              hasValidValue={
                data.discountPercent >= 0 && data.discountPercent <= 100
              }
              isRtl={false}
              min={0}
              max={100}
            />
          </div>
        </div>

        <div className='grid grid-cols-2 w-full gap-2 xl:gap-3 py-3'>
          <button
            className={`btn ${data.isAvailable ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => set('isAvailable', true)}
          >
            {t('edit.sections.items.isAvailable')}
          </button>
          <button
            className={`btn ${!data.isAvailable ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => set('isAvailable', false)}
          >
            {t('edit.sections.items.isNotAvailable')}
          </button>
        </div>

        <ItemOptions
          options={data.options}
          onChange={(opts) => set('options', opts)}
        />

        <div
          className={`grid grid-cols-1 ${loading ? '' : 'lg:grid-cols-2'} gap-2 mt-auto w-full py-3`}
        >
          {loading ? (
            <button className='btn btn-lg btn-warning w-full' disabled={true}>
              <Spinner type={'grow'} />
            </button>
          ) : (
            <>
              <div className='w-full'>
                <button
                  className='btn btn-lg btn-success w-full'
                  onClick={submit}
                >
                  {t('edit.sections.items.save-item')}
                </button>
              </div>
              <div className='w-full'>
                <button
                  className={`btn btn-lg w-full ${isSureForDelete ? 'btn-danger opcaity-100' : 'btn-warning opacity-50'}`}
                  onClick={
                    isSureForDelete
                      ? deleteItem
                      : () => setIsSureForDelete(true)
                  }
                >
                  {t(
                    `edit.sections.items.delete-item${isSureForDelete ? '-sure' : ''}`,
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
