import { getT } from '@i18n/server';
import { domPurifyServer } from '@utils/domPurifyServer';
import Image from 'next/image';
import Link from 'next/link';

export default async function StoreCard({ lng, store }) {
  const { t: tStoreCategories } = await getT(lng, 'store-categories');

  if (!store) return null;

  const navigateToStore = `/${lng}/store/${String(store.slug).toLowerCase()}`;

  const defaultImage = '/images/app-logo.webp';

  return (
    <article className='w-full'>
      <Link href={navigateToStore}>
        <div className='card h-full w-full'>
          <h3 className='font-bold text-center card-header bg-white py-3 px-2'>
            {store.name}
          </h3>
          <div className='card-body'>
            <Image
              className='flex mx-auto mb-3'
              src={store?.logoUrl || defaultImage}
              height={150}
              width={150}
              style={{ objectFit: 'contain' }}
              alt={`${store.name} Logo`}
              loading='lazy'
            />
            <p className={`h4 fw-normal mb-8 text-justify font-bold`}>
              {domPurifyServer(store?.description || '')}
            </p>

            <div className='flex gap-1 justify-between items-center mt-auto flex-wrap'>
              <div className='flex gap-1'>
                {store.categories.map((category) => {
                  return (
                    <span
                      key={`${store.id}-${category.key}`}
                      className='badge rounded btn btn-active'
                    >
                      <small className='text-capitalize'>
                        {tStoreCategories(category.key, category.key)}
                      </small>
                    </span>
                  );
                })}
              </div>
              <div className='flex gap-1 rounded btn btn-active'>
                <span className='font-bold'>
                  {domPurifyServer(store?.location?.provinceLocal || '')}
                </span>
                <span className='italic'>
                  {domPurifyServer(store?.address || '')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
