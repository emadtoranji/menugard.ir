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
      <div className='container-fluid w-auto md:w-full lg:w-9/10 col-xxl-10'>
        <div className='pb-5'>
          <div className='flex items-center justify-between w-full mb-3 mx-auto'>
            <h3>{t('dashboard.finance.topup')}</h3>
            <Link href={`/${currentLang}/dashboard/finance`}>
              <button className='hidden d-md-block btn btn-success font-bold'>
                {t('dashboard.finance.title')}
              </button>
              <button className='btn block md:hidden animate__animated animate__pulse animate__infinite'>
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

          <div className='flex grid grid-cols-md align-items-start justify-center gap-4 w-full mx-auto'>
            <div className='w-full lg:w-1/2 card border-0 shadow rounded'>
              <TopUpForm currentLang={currentLang} />
            </div>
            <div className='w-full card border-0 shadow rounded'>
              <TopUpDescription t={t} />
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
