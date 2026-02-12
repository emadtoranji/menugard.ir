import { getT } from '@i18n/server';
import Image from 'next/image';
import StoreItemsCategories from './StoreItemsCategories';
import Link from 'next/link';

export default async function Intro({ lng }) {
  const { t } = await getT(lng, 'home');

  return (
    <section id='intro' className='w-screen h-screen relative px-0'>
      <div className='container flex flex-col lg:flex-grid justify-start lg:justify-between lg:items-center gap-5 h-full w-full pt-20 lg:pt-0'>
        <div className='order-1 lg:order-2 text-center mb-3 lg:mb-0'>
          <Image
            width={280}
            height={280}
            src='/images/app-logo.webp'
            alt='app logo'
            loading='eager'
            className='w-auto h-auto mx-auto animate__animated animate__flip'
          />
        </div>

        <div className='w-full lg:w-8/12 order-2 lg:order-1'>
          <div className='w-full text-center lg:text-justify'>
            <h2 className='lg:text-4xl font-bold mb-3'>{t('intro.title')}</h2>
            <p className='text-base text-muted leading-relaxed'>
              {t('intro.text')}
            </p>
          </div>

          <div className='w-full flex items-center mt-4 gap-2'>
            <Link
              href={`/${lng}/dashboard`}
              className='px-4 py-2 btn-active rounded-lg hover:font-bold w-full text-center'
            >
              <span className='sr-only'>Intro (Dashboard)</span>
              {t('intro.intro-button')}
            </Link>
            <Link
              href={`/${lng}/store`}
              className='px-4 py-2 btn-inactive rounded-lg hover:font-bold w-full text-center'
            >
              <span className='sr-only'>Store</span>
              {t('intro.stores-button')}
            </Link>
          </div>
        </div>
      </div>

      <StoreItemsCategories />
    </section>
  );
}
