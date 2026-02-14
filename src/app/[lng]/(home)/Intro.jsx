import { getT } from '@i18n/server';
import Image from 'next/image';
import StoreItemsCategories from './StoreItemsCategories';
import Link from 'next/link';

export default async function Intro({ lng }) {
  const { t } = await getT(lng, 'home');

  return (
    <section id='intro' className='w-screen h-screen relative px-0'>
      <div className='container flex flex-col lg:flex-row justify-start lg:justify-between items-center gap-5 h-full w-full'>
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
            <h1 className='font-bold mb-3'>{t('intro.title')}</h1>
            <p className='text-muted leading-relaxed'>{t('intro.text')}</p>
          </div>

          <div className='w-full grid grid-cols-1 sm:grid-cols-2 items-center mt-4 gap-2'>
            <Link href={`/${lng}/dashboard`}>
              <button className='w-full btn btn-lg btn-active'>
                <span className='sr-only'>Intro (Dashboard)</span>{' '}
                {t('intro.intro-button')}
              </button>
            </Link>

            <Link href={`/${lng}/store`}>
              <button className='w-full btn btn-lg btn-inactive'>
                <span className='sr-only'>Store</span>
                {t('intro.stores-button')}
              </button>
            </Link>
          </div>
        </div>
      </div>

      <StoreItemsCategories />
    </section>
  );
}
