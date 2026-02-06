import { getT } from '@i18n/server';
import Image from 'next/image';
import StoreItemsCategories from './StoreItemsCategories';

export default async function Intro({ lng }) {
  const { t } = await getT(lng, 'home');

  return (
    <section
      id='intro'
      className='container-fluid vh-100 w-100 px-0 position-relative'
    >
      <div className='container-lg row align-items-center mx-auto'>
        <div className='col-lg-8 order-1 order-lg-0 text-center'>
          <h2 className='fw-bold mb-4'>{t('intro.title')}</h2>
          <p className='text-muted lh-lg'>{t('intro.text')}</p>
        </div>

        <div className='col-lg-4 order-0 order-lg-1 text-center mb-4 mb-lg-0'>
          <Image
            width={300}
            height={300}
            src='/images/app-logo.webp'
            alt='app logo'
            className='img-fluid mx-auto'
            loading='eager'
          />
        </div>
      </div>

      <div className='container col-12 col-md-8 col-xl-6 d-flex align-items-center mt-5 pt-lg-3 pt-xxl-5 gap-2'>
        <button className='btn btn-active col'>
          {t('intro.intro-button')}
        </button>
        <button className='btn btn-inactive col'>
          {t('intro.stores-button')}
        </button>
      </div>

      <StoreItemsCategories />
    </section>
  );
}
