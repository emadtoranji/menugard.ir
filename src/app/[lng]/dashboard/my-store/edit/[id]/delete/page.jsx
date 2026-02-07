import { getT } from '@i18n/server';
import AnimatedPage from '@components/AnimatedPage';
import Actions from './Actions';
import StoreNotFound from '../../../(components)/StoreNotFound';
import { redirect } from 'next/navigation';
import { auth } from '@utils/auth/NextAuth';
import { domPurifyServer } from '@utils/domPurifyServer';
import Head from '../../../(components)/Head';
import { fallbackLng } from '@i18n/settings';

export default async function Page({ params }) {
  const { lng = fallbackLng, id = null } = await params;
  if (!id) {
    return <StoreNotFound />;
  }

  const { t } = await getT(lng, 'dashboard-my-store');
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect(`/${lng}/signout`);
  }

  let store = {};
  try {
    store = await prisma.store.findUnique({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      where: {
        id: String(id),
        userId,
      },
    });
  } catch {
    store = {};
  }
  if (!store || !store?.id) {
    return <StoreNotFound />;
  }
  return (
    <AnimatedPage>
      <div className='container'>
        <Head
          lng={lng}
          title='delete.title'
          subTitle='delete.subtitle'
          id={id}
          hasStore={true}
          hasHomeEdit={true}
        />

        <div className='d-flex gap-2 mt-4 mb-5'>
          <div
            dangerouslySetInnerHTML={{
              __html: domPurifyServer(
                t('delete.delete-description', { name: store.name }),
              ),
            }}
          />
        </div>

        <div className='container'>
          <Actions key={`edit-delete-buttons-${store.id}`} id={id} />
        </div>
      </div>
    </AnimatedPage>
  );
}
