import StoreNotFound from '../../../StoreNotFound';
import { getStores } from '@server/getStores';
import { getT } from '@i18n/server';
import StoreComponent from './StoreComponent';
import { headers } from 'next/headers';
import LogCookie from './LogCookie';
import { storeExplorerSource } from '@/src/lib/prismaEnums';

export default async function Page({ params, searchParams }) {
  const { lng, slug = undefined } = (await params) || {};
  const { t } = await getT(lng, 'store');
  const useSearchParams = await searchParams;
  const tableId = useSearchParams?.table ?? useSearchParams?.utm_table ?? null;
  const source =
    useSearchParams?.source ?? useSearchParams?.utm_source ?? 'direct';

  if (!slug) return <StoreNotFound t={t} />;

  const response = await getStores({ slug });
  const store = response?.result ?? {};

  if (!store?.slug) return <StoreNotFound t={t} />;
  const headersList = await headers();

  return (
    <section className='container-fluid'>
      <LogCookie
        storeId={store.id}
        tableId={tableId}
        source={storeExplorerSource.includes(source) ? source : 'unknown'}
        ipAddress={
          headersList.get('cf-connecting-ip') ||
          headersList.get('x-forwarded-for')?.split(',')[0] ||
          headersList.get('x-real-ip') ||
          null
        }
      />
      <StoreComponent store={store} lng={lng} />
    </section>
  );
}
