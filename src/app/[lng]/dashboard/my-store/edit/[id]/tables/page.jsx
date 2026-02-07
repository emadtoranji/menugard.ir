import { getT } from '@i18n/server';
import AnimatedPage from '@components/AnimatedPage';
import TablesComponent from './TablesComponent';
import StoreNotFound from '../../../(components)/StoreNotFound';
import { redirect } from 'next/navigation';
import { auth } from '@utils/auth/NextAuth';
import Head from '../../../(components)/Head';

export default async function Index({ params }) {
  const { lng, id } = (await params) || {};
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
        tables: true,
      },
      where: {
        id,
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
          title='edit.sections.tables.title'
          subTitle='edit.sections.tables.description'
          id={id}
          hasStore={true}
          hasHomeEdit={true}
          hasDelete={true}
        />

        <TablesComponent
          key={`edit-tables-component-${store.id}`}
          store={store}
        />
      </div>
    </AnimatedPage>
  );
}
