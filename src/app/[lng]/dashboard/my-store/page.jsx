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
              <h4>{t('general.unknown-problem')}</h4>
            ) : myStoresData.length ? (
              <div className='row g-3 mb-4'>
                {myStoresData.map((item) => {
                  return (
                    <div key={item.id} className='col-12 col-md-6 col-xl-4'>
                      <div className='card p-1 shadow-lg border-0 h-100'>
                        <div className='container'>
                          <Image
                            src={item?.logoUrl || `/images/app-logo.webp`}
                            height={250}
                            width={250}
                            style={{ objectFit: 'contain' }}
                            className='card-img-top'
                            alt={`Logo ${item?.slug}`}
                          />
                        </div>
                        <div className='card-body'>
                          <div className='d-flex align-items-center justify-content-between'>
                            <h5 className='card-title'>{item?.name || '-'}</h5>
                            <i
                              className={`bi ${item?.isActive ? 'bi-bag-check text-success' : 'bi-bag-x text-danger'} fs-2`}
                            ></i>
                          </div>
                          <p className='card-text'>{item?.description || ''}</p>
                          <div className='d-flex gap-2 w-100'>
                            <Link
                              href={`/${lng}/store/${item?.slug}`}
                              className='btn btn-success text-light col-6'
                            >
                              {t('user-experience-button')}
                            </Link>
                            <Link
                              href={`/${lng}/dashboard/my-store/edit/${item?.id}`}
                              className='btn btn-primary text-light col-6'
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
                <div
                  className='mt-5 muted-small'
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
