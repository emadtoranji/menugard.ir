import { getT } from '@i18n/server';
import FooterMessageYear from './FooterMessageYear';

import Link from 'next/link';
import { Suspense } from 'react';

export default async function Footer({ lng }) {
  const { t } = await getT(lng, 'header-footer');

  return (
    <footer id='footer' className='mt-auto pt-4 pb-3 text-center'>
      <div className='container'>
        <div className='row g-4'>
          <div className='col'>
            <h5 className='mb-3 fw-semibold'>{t('footer.brand')}</h5>
            <p className='small mb-0 lh-sm'>{t('footer.description')}</p>
          </div>

          <hr className='d-block d-lg-none my-4 border-light border-opacity-25' />

          <div className='col-12 col-lg-5'>
            <h6 className='fw-bold mb-3'>{t('footer.quick_links.title')}</h6>
            <ul className='list-unstyled row row-cols-1 row-cols-sm-2 g-2 m-0 p-0'>
              <li className='col'>
                <Link
                  href={`/${lng}/#features`}
                  className='text-decoration-none'
                >
                  {t('footer.quick_links.features')}
                </Link>
              </li>
              <li className='col'>
                <Link href={`/${lng}/store`} className='text-decoration-none'>
                  {t('footer.quick_links.store')}
                </Link>
              </li>
              <li className='col'>
                <Link
                  href={`/${lng}/dashboard`}
                  className='text-decoration-none'
                >
                  {t('footer.quick_links.dashboard')}
                </Link>
              </li>
              <li className='col'>
                <Link
                  href={process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM || '/'}
                  target='_blank'
                  className='text-decoration-none'
                >
                  {t('footer.quick_links.support')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className='my-4 border-light border-opacity-25' />

        <div className='row gy-3 align-items-center text-center'>
          <div className='col-12'>
            <Suspense fallback={undefined}>
              <FooterMessageYear />
            </Suspense>
          </div>
        </div>

        <div className='row mt-2'>
          <div className='col text-center'>
            <div className='d-flex justify-content-center gap-3'>
              <Link
                href={process.env.NEXT_PUBLIC_DEVELOPER_X || '/'}
                target='_blank'
                aria-label='X'
              >
                <i className='bi bi-twitter fs-5'></i>
              </Link>
              <Link
                href={process.env.NEXT_PUBLIC_DEVELOPER_GITHUB || '/'}
                target='_blank'
                aria-label='GitHub'
              >
                <i className='bi bi-github fs-5'></i>
              </Link>
              <Link
                href={process.env.NEXT_PUBLIC_DEVELOPER_TELEGRAM || '/'}
                target='_blank'
                aria-label='Telegram'
              >
                <i className='bi bi-telegram fs-5'></i>
              </Link>
              <Link
                href={process.env.NEXT_PUBLIC_DEVELOPER_LINKEDIN || '/'}
                target='_blank'
                aria-label='LinkedIn'
              >
                <i className='d-none bi bi-linkedin fs-5'></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
