import { getT } from '@i18n/server';
import FooterMessageYear from './FooterMessageYear';

import Link from 'next/link';
import { Suspense } from 'react';

export default async function Footer({ lng }) {
  const { t } = await getT(lng, 'header-footer');

  return (
    <footer id='footer' className='mt-auto pt-8 pb-3 text-center'>
      <div className='container lg:flex lg:justify-between items-center gap-3 xl:gap-5 2xl:gap-8 text-center'>
        <div className='w-auto'>
          <h4 className='mb-3 font-semibold'>{t('footer.brand')}</h4>
          <h5 className=''>
            <p>{t('footer.description')}</p>
          </h5>
        </div>

        <div className='w-full lg:w-1/3 pt-3 mt-3 border-t-2 border-white/25 lg:border-0 lg:mt-auto lg:pt-0'>
          <h5 className='font-bold mb-3'>{t('footer.quick_links.title')}</h5>
          <ul className='grid grid-cols-1 md:grid-cols-2 gap-4 text-nowrap'>
            <li>
              <Link href={`/${lng}/faqs`}>{t('footer.quick_links.faqs')}</Link>
            </li>
            <li>
              <Link href={`/${lng}/store`}>
                {t('footer.quick_links.store')}
              </Link>
            </li>
            <li>
              <Link href={`/${lng}/dashboard`}>
                {t('footer.quick_links.dashboard')}
              </Link>
            </li>
            <li>
              <Link
                href={process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM || '/'}
                target='_blank'
              >
                {t('footer.quick_links.support')}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className='container mt-5'>
        <div className='border-t-3 border-white/25 mb-3'></div>
        <div className='w-full text-center flex justify-center mb-4'>
          <Suspense fallback={undefined}>
            <FooterMessageYear />
          </Suspense>
        </div>

        <div className='w-full text-center flex justify-center gap-5'>
          <Link
            href={process.env.NEXT_PUBLIC_DEVELOPER_X || '/'}
            target='_blank'
            aria-label='X'
          >
            <i className='icon bi bi-twitter text-2xl'></i>
          </Link>
          <Link
            href={process.env.NEXT_PUBLIC_DEVELOPER_GITHUB || '/'}
            target='_blank'
            aria-label='GitHub'
          >
            <i className='icon bi bi-github text-2xl'></i>
          </Link>
          <Link
            href={process.env.NEXT_PUBLIC_DEVELOPER_TELEGRAM || '/'}
            target='_blank'
            aria-label='Telegram'
          >
            <i className='icon bi bi-telegram text-2xl'></i>
          </Link>
          <Link
            href={process.env.NEXT_PUBLIC_DEVELOPER_LINKEDIN || '/'}
            target='_blank'
            aria-label='LinkedIn'
          >
            <i className='icon bi bi-linkedin text-2xl'></i>
          </Link>
        </div>
      </div>
    </footer>
  );
}
