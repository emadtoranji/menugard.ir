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
        <div className='d-flex flex-column gap-2 mb-3'>
          <h3>{t('dashboard.overview.title')}</h3>
          <div className='muted-small'>{t('dashboard.overview.subtitle')}</div>
        </div>

        {storeStatsData === null ? (
          <Loading />
        ) : (
          storeStatsData.map((store) => (
            <div key={store.id} className='mb-4 pb-3 border-bottom'>
              <h2 className='mb-3'>{store.name}</h2>
              <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3 mb-4'>
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
                    <div className='card border-0 shadow rounded p-3'>
                      <div className='muted-small'>{label}</div>
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
