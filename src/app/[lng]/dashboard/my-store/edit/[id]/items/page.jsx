import AnimatedPage from '@components/AnimatedPage';
import ItemsComponent from './ItemsComponent';
import StoreNotFound from '../../../(components)/StoreNotFound';
import { redirect } from 'next/navigation';
import { auth } from '@utils/auth/NextAuth';
import Head from '../../../(components)/Head';
import { storeItemsCategoriesKey } from '@lib/prismaEnums';
import { fallbackLng } from '@i18n/settings';

export default async function Index({ params }) {
  const { lng = fallbackLng, id = null } = await params;
  if (!id) {
    return <StoreNotFound />;
  }

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
        items: {
          select: {
            id: true,
            category: true,
            title: true,
            description: true,
            price: true,
            discountPercent: true,
            imageUrl: true,
            isAvailable: true,
            isActive: true,
            options: {
              select: {
                title: true,
                isRequired: true,
                minSelect: true,
                maxSelect: true,
                price: true,
                discountPercent: true,
                isActive: true,
              },
              where: {
                userId,
              },
            },
          },
          where: {
            userId,
          },
        },
      },
      where: {
        id: String(id),
        userId,
      },
    });
  } catch (e) {
    store = undefined;
  }

  if (!store || !store?.id) {
    return <StoreNotFound />;
  }

  return (
    <AnimatedPage>
      <div className='container-fluid px-0 px-lg-2 px-xxl-3'>
        <div className='container-lg'>
          <Head
            lng={lng}
            title='edit.sections.items.title'
            subTitle='edit.sections.items.description'
            id={id}
            hasStore={true}
            hasHomeEdit={true}
            hasDelete={true}
          />
        </div>

        <ItemsComponent
          key={`edit-items-component-${store.id}`}
          StoreItemsCategoriesKey={storeItemsCategoriesKey}
          store={store}
        />
      </div>
    </AnimatedPage>
  );
}
