import { getT } from '@i18n/server';
import { domPurifyServer } from '@utils/domPurifyServer';
import Image from 'next/image';
import Link from 'next/link';

export default async function StoreCard({ lng, store }) {
  const { t } = await getT(lng, 'store');
  const { t: tStoreCategories } = await getT(lng, 'store-categories');

  if (!store) return null;

  const navigateToStore = `/${lng}/store/${String(store.slug).toLowerCase()}`;

  const defaultImage = '/images/app-logo.webp';

  return (
    <article className='col'>
      <Link href={navigateToStore}>
        <div className='card h-100 w-100 border-0 shadow rounded'>
          <h4 className='fw-bold text-center card-header bg-white py-3 px-2'>
            {store.name}
          </h4>
          <div className='card-body'>
            <Image
              className='d-flex mx-auto mb-3'
              src={store?.logoUrl || defaultImage}
              height={150}
              width={150}
              style={{ objectFit: 'contain' }}
              alt={`${store.name} Logo`}
            />
            <p className={`h6 fw-normal mb-4 flex-grow-1 text-justify fw-bold`}>
              {domPurifyServer(store?.description || '')}
            </p>

            <div className='d-flex gap-1 justify-content-between align-items-center mt-auto flex-wrap'>
              <div className='d-flex gap-1'>
                {store.categories.map((category) => {
                  return (
                    <span
                      key={`${store.id}-${category}`}
                      className='badge btn-active'
                    >
                      <small className='text-capitalize'>
                        {tStoreCategories(category.key, category.key)}
                      </small>
                    </span>
                  );
                })}
              </div>
              <div className='d-flex gap-1 badge btn-active'>
                <span className='fw-bold'>
                  {domPurifyServer(store?.location?.provinceLocal || '')}
                </span>
                <span className='fst-italic'>
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
