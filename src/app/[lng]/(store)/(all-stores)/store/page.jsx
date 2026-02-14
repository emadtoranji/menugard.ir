import StoreCard from './StoreCard';
import SearchForm from './SearchForm';
import { getStores } from '@server/getStores';
import StoreNotFound from '../../StoreNotFound';
import { getT } from '@i18n/server';
import { cache } from 'react';
import { Pagination } from './Pagination';

const fetchStoreCached = cache(async ({ slug, page, search }) => {
  const response = await getStores({ slug, page, search });

  if (!response?.ok) {
    return {
      stores: [],
      pagination: { current_page: 1, total_items: 0, total_pages: 1 },
    };
  }

  const data = Array.isArray(response.result?.data) ? response.result.data : [];

  return {
    stores: data,
    pagination: {
      current_page: parseInt(response.result?.current_page || 1),
      total_items: parseInt(response.result?.total_items || 0),
      total_pages: parseInt(response.result?.total_pages || 1),
    },
  };
});

export default async function Page({ params, searchParams }) {
  const { lng = undefined } = (await params) || {};
  const { t, lng: currentLang } = await getT(lng, 'store');
  const searchP = await searchParams;
  const slug = (await searchP?.slug) ?? '';
  const slugFiltered = typeof slug === 'string' && slug.length > 0;
  const page = Math.max(parseInt((await searchP?.page) ?? 1), 1);
  const search = (await searchP?.search) ?? '';
  const { stores, pagination } = await fetchStoreCached({
    slug,
    page,
    search,
  });

  const title = slugFiltered && stores.length > 0 ? stores[0].title : undefined;

  return (
    <div className='mb-12'>
      <SearchForm search={search} slugFiltered={slugFiltered} title={title} />

      <div className='container my-5'>
        {stores.length === 0 && !slugFiltered && <StoreNotFound t={t} />}

        {stores.length > 0 && (
          <div className='mx-auto grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4 3xl:grid-cols-4 gap-3'>
            {stores.map((store, index) => (
              <StoreCard
                key={`storeBox-${store?.slug || index}`}
                store={store}
                lng={lng}
              />
            ))}
          </div>
        )}
      </div>

      <Pagination
        current_page={pagination.current_page}
        total_pages={pagination.total_pages}
        lng={currentLang}
        slug={slug}
        search={search}
      />
    </div>
  );
}
