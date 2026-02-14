import { getT } from '@i18n/server';
import AnimatedPage from '@components/AnimatedPage';
import Table from '@components/Table/Index';
import { MAIN_CURRENCY } from '@utils/globalSettings';
import { formatNumber } from '@utils/numbers';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@utils/auth/NextAuth';
import { redirect } from 'next/navigation';

export default async function FinancePage({ params }) {
  const { lng } = (await params) || {};
  redirect(`/${lng}/dashboard`);
  return;

  const { t, lng: currentLang } = await getT(lng, 'dashboard');

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect(`/${lng}/signout`);
  }

  let user = { balance: 0, currentLang: MAIN_CURRENCY };
  try {
    user = await prisma.user.findUnique({
      select: {
        balance: true,
        currency: true,
      },
      where: {
        id: userId,
      },
    });
  } catch {}

  const balance = formatNumber(user?.balance, currentLang);

  let paymentsResult = {};
  try {
    const paymentsData = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    paymentsResult = paymentsData.map((p) => ({
      id: p.id,
      amount: { action: 'formatNumber', value: p.amount },
      currency: { action: 't', value: `currencies.${p.currency}` },
      created_at: { action: 'date', value: p.createdAt },
      status: { action: 'status', value: p.status },
      paidAt: { action: 'date', value: p.paidAt },
    }));
  } catch {}

  return (
    <AnimatedPage>
      <div className='container'>
        <div className='pb-5'>
          <div className='flex items-center justify-between mb-3'>
            <h3>{t('dashboard.finance.title')}</h3>
            <Link href={`/${currentLang}/dashboard/finance/topup`}>
              <button className='hidden d-md-block btn btn-success font-bold'>
                {t('dashboard.finance.topup')}
              </button>
              <button className='btn block md:hidden animate__animated animate__pulse animate__infinite'>
                <Image
                  src='/images/dashboard/capital-gain.png'
                  className=''
                  width={50}
                  height={50}
                  alt='topup'
                />
              </button>
            </Link>
          </div>

          <div className=''>
            <div className='grid gap-3'>
              <div
                className='w-full lg:w-1/2'
                style={{ height: 'fit-content' }}
              >
                <div className='card p-3 border-0 shadow rounded h-full'>
                  <div className=''>
                    <div>
                      <div className='text-gray-600 small'>
                        {t('dashboard.finance.balance')}
                      </div>
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='fs-3 font-bold'>{balance}</div>
                      <div className='text-gray-600 small currency-font text-xl'>
                        {t(
                          `currencies.${user?.currency || MAIN_CURRENCY}`,
                          user?.currency || MAIN_CURRENCY,
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-full'>
                <div className='card p-3 border-0 shadow rounded'>
                  <h6>{t('dashboard.finance.recentTransactions')}</h6>
                  <Table
                    data={paymentsResult}
                    t={t}
                    currentLang={currentLang}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
