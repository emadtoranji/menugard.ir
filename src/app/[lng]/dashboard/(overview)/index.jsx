'use client';

import { useEffect, useState } from 'react';
import AnimatedPage from '@components/AnimatedPage';
import { formatNumber } from '@utils/numbers';
import { useT } from '@i18n/client';
import toast from 'react-hot-toast';
import Loading from '@app/loading';
import { fallbackLng } from '@i18n/settings';
import { useParams } from 'next/navigation';

export default function Dashboard({ params }) {
  const { t } = useT('dashboard');
  const lng = useParams()?.lng || fallbackLng;
  const [storeStatsData, setStoreStatsData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/dashboard/store/store-explorer-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) return;
      const data = await res.json();

      if (data?.ok && Array.isArray(data?.result)) {
        setStoreStatsData(data.result);
      } else {
        toast.error(
          `code-responses.${data?.message}`,
          'general.unknown-problem',
        );
        setStoreStatsData([]);
      }
    }
    fetchData();
  }, [params]);

  return (
    <AnimatedPage>
      <div className='container mx-auto'>
        <div className='flex flex-col gap-2 mb-3'>
          <h3 className=''>{t('dashboard.overview.title')}</h3>
          <div className=''>{t('dashboard.overview.subtitle')}</div>
        </div>

        {storeStatsData === null ? (
          <Loading />
        ) : (
          storeStatsData.map((store) => (
            <div
              key={store.id}
              className='mb-8 pb-3 border-b border-gray-400 last:border-b-0'
            >
              <h2 className='mb-3'>{store.name}</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid:cols-5 3xl:grid:cols-6 gap-3 mb-8'>
                {[
                  { key: 'today', label: t('dashboard.stats.today') },
                  { key: 'yesterday', label: t('dashboard.stats.yesterday') },
                  {
                    key: 'current_month',
                    label: t('dashboard.stats.currentMonth'),
                  },
                  {
                    key: 'previous_month',
                    label: t('dashboard.stats.previousMonth'),
                  },
                  {
                    key: 'current_year',
                    label: t('dashboard.stats.currentYear'),
                  },
                  {
                    key: 'previous_year',
                    label: t('dashboard.stats.previousYear'),
                  },
                  { key: 'all', label: t('dashboard.stats.all') },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <div className='card p-3'>
                      <div className='text-lg'>{label}</div>
                      <div className='big-number'>
                        {formatNumber(store.stats[key], lng) || '-'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </AnimatedPage>
  );
}
