import { getT } from '@i18n/server';
import FooterMessageYear from './FooterMessageYear';

import Link from 'next/link';
import { Suspense } from 'react';

export default async function Footer({ lng }) {
  const { t } = await getT(lng, 'header-footer');

  const hrClass = 'block lg:hidden my-8 border border-white/10';

  return (
    <footer
      id='footer'
      className='mt-auto pt-8 pb-3 text-center bg-[var(--color-bg-nav)] text-[var(--color-text-nav)]'
    >
      <div className='container lg:flex lg:justify-between items-center gap-5'>
        <div className='w-full lg:w-1/3'>
          <h5 className='mb-3 font-semibold'>{t('footer.brand')}</h5>
          <p className='text-base mb-0'>{t('footer.description')}</p>
        </div>

        <hr className={hrClass} />

        <div className='w-full lg:w-1/3'>
          <h6 className='font-bold mb-3'>{t('footer.quick_links.title')}</h6>
          <ul className='grid grid-flow-col grid-rows-4 sm:grid-rows-2  gap-4 m-0 p-0'>
            <li className='w-full'>
              <Link href={`/${lng}/faqs`}>{t('footer.quick_links.faqs')}</Link>
            </li>
            <li className='w-full'>
              <Link href={`/${lng}/store`}>
                {t('footer.quick_links.store')}
              </Link>
            </li>
            <li className='w-full'>
              <Link href={`/${lng}/dashboard`}>
                {t('footer.quick_links.dashboard')}
              </Link>
            </li>
            <li className='w-full'>
              <Link
                href={process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM || '/'}
                target='_blank'
              >
                {t('footer.quick_links.support')}
              </Link>
            </li>
          </ul>
        </div>

        <hr className={hrClass} />
      </div>

      <div className='w-full text-center flex justify-center mb-4 mt-8'>
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
          <i className='bi bi-twitter text-2xl'></i>
        </Link>
        <Link
          href={process.env.NEXT_PUBLIC_DEVELOPER_GITHUB || '/'}
          target='_blank'
          aria-label='GitHub'
        >
          <i className='bi bi-github text-2xl'></i>
        </Link>
        <Link
          href={process.env.NEXT_PUBLIC_DEVELOPER_TELEGRAM || '/'}
          target='_blank'
          aria-label='Telegram'
        >
          <i className='bi bi-telegram text-2xl'></i>
        </Link>
        <Link
          href={process.env.NEXT_PUBLIC_DEVELOPER_LINKEDIN || '/'}
          target='_blank'
          aria-label='LinkedIn'
        >
          <i className='hidden bi bi-linkedin text-2xl'></i>
        </Link>
      </div>
    </footer>
  );
}
