import { fallbackLng } from '@i18n/settings';
import { getT } from '@i18n/server';
import Link from 'next/link';

export default async function Head({
  lng = fallbackLng,
  title = '',
  subTitle = '',
  id = undefined,
  hasStore = false,
  hasHomeEdit = false,
  hasNew = false,
  hasDelete = false,
}) {
  const { t } = await getT(lng, 'dashboard-my-store');

  if (!id) {
    // id required
    hasHomeEdit = false;
    hasDelete = false;
    // set a minimum true
    if (!hasNew && !hasStore) {
      hasNew = true;
      hasStore = true;
    }
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <h3 className='h3'>{t(title)}</h3>
        <div className='flex gap-1 sm:gap-2 md:gap-3 lg:gap-4'>
          {!hasDelete ? undefined : (
            <Link
              href={`/${lng}/dashboard/my-store/edit/${id}/delete`}
              className='w-full'
            >
              <i type='button' className='bi bi-trash3-fill text-danger h3'></i>
            </Link>
          )}
          {!hasNew ? undefined : (
            <Link href={`/${lng}/dashboard/my-store/new`} className='w-full'>
              <i
                type='button'
                className='bi bi-plus-circle-fill text-active h3'
              ></i>
            </Link>
          )}
          {!hasHomeEdit ? undefined : (
            <Link
              href={`/${lng}/dashboard/my-store/edit/${id}`}
              className='w-full'
            >
              <i
                type='button'
                className='bi bi-pencil-square text-danger-emphasis h3'
              ></i>
            </Link>
          )}
          {!hasStore ? undefined : (
            <Link href={`/${lng}/dashboard/my-store`} className='w-full'>
              <i type='button' className='bi bi-shop text-success h3'></i>
            </Link>
          )}
        </div>
      </div>
      <div className='px-2 mb-3 py-2 border-b border-gray-400'>
        {t(subTitle)}
      </div>
    </>
  );
}
