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
        <h2 className='font-bold'>{t(title)}</h2>
        <div className='flex gap-1 sm:gap-2 md:gap-3 lg:gap-4'>
          {!hasDelete ? undefined : (
            <Link
              href={`/${lng}/dashboard/my-store/edit/${id}/delete`}
              className='w-full'
            >
              <i
                type='button'
                className='icon-lg bi bi-trash3-fill text-danger'
              ></i>
            </Link>
          )}
          {!hasNew ? undefined : (
            <Link href={`/${lng}/dashboard/my-store/new`} className='w-full'>
              <i
                type='button'
                className='icon-lg bi bi-plus-circle-fill text-active'
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
                className='icon-lg bi bi-pencil-square text-danger-emphasis'
              ></i>
            </Link>
          )}
          {!hasStore ? undefined : (
            <Link href={`/${lng}/dashboard/my-store`} className='w-full'>
              <i type='button' className='icon-lg bi bi-shop text-success'></i>
            </Link>
          )}
        </div>
      </div>
      <div className='px-2 mb-5 py-2 border-b-2 border-purple-300'>
        {t(subTitle)}
      </div>
    </>
  );
}
