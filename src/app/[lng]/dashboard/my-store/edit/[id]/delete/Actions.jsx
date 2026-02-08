'use client';

import { useT } from '@i18n/client';
import { fallbackLng } from '@i18n/settings';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Actions({ id }) {
  const { t } = useT('dashboard-my-store');
  const lng = useParams()?.lng || fallbackLng;
  const router = useRouter();

  async function handleDeleteStore() {
    try {
      const res = await fetch('/api/dashboard/store/store-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      }).then((res) => res.json());
      if (res.ok) {
        toast.success(t('delete.store-deleted'));

        router.push(`/${lng}/dashboard/my-store`);
      } else {
        toast.error(
          t(
            `code-responses.${result?.message}`,
            result?.message || t('general.unknown-problem'),
          ),
        );
      }
    } catch {
      toast.error(t('general.unknown-problem'));
    }
  }

  return (
    <div className='row g-3 col-12'>
      <div className='col-12 col-md-6'>
        <button
          className='w-100 btn btn-danger btn-lg'
          onClick={handleDeleteStore}
        >
          {t('delete.delete-sure-button')}
        </button>
      </div>
      <Link href={`/${lng}/dashboard/my-store`} className='col-12 col-md-6'>
        <button className='w-100 btn btn-success btn-lg'>
          {t('delete.delete-rejected-button')}
        </button>
      </Link>
    </div>
  );
}
