import { getT } from '@i18n/server';
import { TopUpForm } from './TopUpForm';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedPage from '@components/AnimatedPage';
import { TopUpDescription } from './TopUpDescription';
import { redirect } from 'next/navigation';

export default async function Index({ params }) {
  const { lng } = (await params) || {};
  redirect(`/${lng}/dashboard`);
  return;

  const { t, lng: currentLang } = await getT(lng, 'dashboard');

  return (
    <AnimatedPage>
      <div className='container-fluid col-auto col-md-12 col-lg-11 col-xxl-10'>
        <div className='pb-5'>
          <div className='d-flex align-items-center justify-content-between col mb-3 mx-auto'>
            <h3>{t('dashboard.finance.topup')}</h3>
            <Link href={`/${currentLang}/dashboard/finance`}>
              <button className='d-none d-md-block btn btn-success fw-bold'>
                {t('dashboard.finance.title')}
              </button>
              <button className='btn d-block d-md-none animate__animated animate__pulse animate__infinite'>
                <Image
                  src='/images/dashboard/transaction-history.png'
                  className=''
                  width={50}
                  height={50}
                  alt='history'
                />
              </button>
            </Link>
          </div>

          <div className='d-flex row row-cols-md align-items-start justify-content-center gap-4 col-12 mx-auto'>
            <div className='col-12 col-lg-6 card border-0 shadow rounded'>
              <TopUpForm currentLang={currentLang} />
            </div>
            <div className='col card border-0 shadow rounded'>
              <TopUpDescription t={t} />
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
