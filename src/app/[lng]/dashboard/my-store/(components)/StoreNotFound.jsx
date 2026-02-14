import { fallbackLng } from '@/src/app/i18n/settings';
import { getT } from '@i18n/server';
import Link from 'next/link';

export default async function StoreNotFound({ params }) {
  const { lng = fallbackLng } = (await params) || {};
  const { t } = await getT(lng, 'dashboard-my-store');
  return (
    <div className='container'>
      <div className='flex justify-between gap-2'>
        <h3>{t('store-not-found')}</h3>
        <Link href={`/${lng}/dashboard/my-store`}>
          <button className='btn btn-success shadow-lg'>{t('my-store')}</button>
        </Link>
      </div>
    </div>
  );
}
