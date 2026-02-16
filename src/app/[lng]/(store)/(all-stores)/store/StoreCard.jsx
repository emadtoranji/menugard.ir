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
        <div className='card h-full w-full shadow-lg border border-purple'>
          <h3 className='font-bold text-center card-header px-2'>
            {store.name}
          </h3>
          <div className='card-body'>
            <Image
              className='m-auto'
              src={store?.logoUrl || defaultImage}
              height={150}
              width={150}
              style={{ objectFit: 'contain' }}
              alt={`${store.name} Logo`}
              loading='lazy'
            />
            <p className={`h4 fw-normal mt-2 mb-8 text-justify font-bold`}>
              {domPurifyServer(store?.description || '')}
            </p>
            <div className='flex gap-1 justify-between items-center mt-auto flex-wrap'>
              <div className='flex flex-wrap gap-2'>
                {store.categories.map((category) => {
                  return (
                    <span
                      key={`${store.id}-${category.key}`}
                      className='rounded btn btn-active font-bold text-nowrap'
                    >
                      <small className='text-capitalize'>
                        {tStoreCategories(category.key, category.key)}
                      </small>
                    </span>
                  );
                })}
              </div>
            </div>
            <p className='flex gap-1 mt-4'>
              <Image
                alt='address'
                className='icon'
                height={25}
                width={25}
                src={'/images/store/road-sign.svg'}
              />
              <span className='font-semibold'>
                {domPurifyServer(store?.location?.provinceLocal || '')}
              </span>
              <span>{domPurifyServer(store.address || '')}</span>
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
