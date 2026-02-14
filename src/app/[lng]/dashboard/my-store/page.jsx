import { getT } from '@i18n/server';
import AnimatedPage from '@components/AnimatedPage';
import Link from 'next/link';
import { domPurifyServer } from '@utils/domPurifyServer';
import Image from 'next/image';
import prisma from '@lib/prisma';
import { redirect } from 'next/navigation';
import { auth } from '@utils/auth/NextAuth';
import Head from './(components)/Head';

export default async function Index({ params }) {
  const { lng } = (await params) || {};
  const { t } = await getT(lng, 'dashboard-my-store');

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect(`/${lng}/signout`);
  }

  let myStoresData = undefined;
  try {
    myStoresData = await prisma.store.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        isActive: true,
        updatedAt: true,
      },
      where: {
        userId,
      },
    });
  } catch {}

  return (
    <AnimatedPage>
      <div className='container-fluid'>
        <div className='container'>
          <Head
            lng={lng}
            title='my-store'
            subTitle='my-store-description'
            hasNew={true}
          />

          <>
            {myStoresData === undefined ? (
              <h2>{t('general.unknown-problem')}</h2>
            ) : myStoresData.length ? (
              <div className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-1 md:gap-2 2xl:gap-3 mb-8'>
                {myStoresData.map((item) => {
                  return (
                    <div key={item.id} className='w-full h-full'>
                      <div className='card p-1 h-full'>
                        <div className=''>
                          <Image
                            src={item?.logoUrl || `/images/app-logo.webp`}
                            height={200}
                            width={200}
                            style={{ objectFit: 'contain' }}
                            className='mx-auto'
                            alt={`Logo ${item?.slug}`}
                          />
                        </div>
                        <div className='card-body'>
                          <div className='flex items-center justify-between'>
                            <h3 className='font-bold'>{item?.name || '-'}</h3>
                            <i
                              className={`bi ${item?.isActive ? 'bi-bag-check-fill text-success' : 'bi-bag-x text-danger'} icon-lg`}
                            ></i>
                          </div>
                          <p className='text-lg font-medium my-2 px-1'>
                            {item?.description || ''}
                          </p>
                          <div className='flex gap-2 w-full text-center mt-8'>
                            <Link
                              href={`/${lng}/store/${item?.slug}`}
                              className='btn btn-lg btn-success w-1/2'
                            >
                              {t('user-experience-button')}
                            </Link>
                            <Link
                              href={`/${lng}/dashboard/my-store/edit/${item?.id}`}
                              className='btn btn-lg btn-primary w-1/2'
                            >
                              {t('edit-button')}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Link href={`/${lng}/dashboard/my-store/new`}>
                <h3
                  className='mt-5'
                  dangerouslySetInnerHTML={{
                    __html: domPurifyServer(t('no-store-found')),
                  }}
                />
              </Link>
            )}
          </>
        </div>
      </div>
    </AnimatedPage>
  );
}
