import { getT } from '@i18n/server';
import Image from 'next/image';
import StoreItemsCategories from './StoreItemsCategories';
import Link from 'next/link';

export default async function Intro({ lng }) {
  const { t } = await getT(lng, 'home');

  return (
    <section
      id='intro'
      className='container-fluid vh-100 w-100 px-0 position-relative'
    >
      <div className='container d-flex flex-column flex-lg-row justify-content-start justify-content-lg-between align-items-lg-center gap-5 h-100 w-100 pt-5 pt-lg-0'>
        <div className='order-1 order-lg-2 text-center mb-3 mb-lg-0'>
          <Image
            width={280}
            height={280}
            src='/images/app-logo.webp'
            alt='app logo'
            loading='eager'
            className='img-fluid animate__animated animate__flip'
          />
        </div>

        <div className='col-12 col-lg-8 order-2 order-lg-1'>
          <div className='w-100 text-justify'>
            <h2 className='fw-bold mb-3'>{t('intro.title')}</h2>
            <p className='text-muted lh-lg'>{t('intro.text')}</p>
          </div>

          <div className='w-100 d-flex align-items-center mt-4 gap-2'>
            <Link
              href={`/${lng}/dashboard`}
              className='btn btn-active btn-lg w-100'
            >
              <span className='visually-hidden'>Intro (Dashboard)</span>
              {t('intro.intro-button')}
            </Link>
            <Link
              href={`/${lng}/store`}
              className='btn btn-inactive btn-lg w-100'
            >
              <span className='visually-hidden'>Store</span>
              {t('intro.stores-button')}
            </Link>
          </div>
        </div>
      </div>

      <StoreItemsCategories />
    </section>
  );
}
