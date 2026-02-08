import AnimatedPage from '@components/AnimatedPage';
import Form from '../../../(components)/StoreForm';
import { storeCategories, storeCurrencies } from '@lib/prismaEnums';
import StoreNotFound from '../../../(components)/StoreNotFound';
import { redirect } from 'next/navigation';
import { auth } from '@utils/auth/NextAuth';
import Head from '../../../(components)/Head';
import { fallbackLng } from '@i18n/settings';
import prisma from '@lib/prisma';

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
    store = await prisma.store.findFirst({
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        location: true,
        address: true,
        phone: true,
        logoUrl: true,
        currency: true,
        taxEnabled: true,
        taxIncluded: true,
        taxPercent: true,
        parentStoreId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        categories: true,
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

  store.country = store?.location?.countrySlug || '';
  store.province = store?.location?.provinceSlug || '';
  store.categories = (
    Array.isArray(store?.categories) ? store.categories : []
  ).map((category) => category.key);

  return (
    <AnimatedPage>
      <div className='container'>
        <Head
          lng={lng}
          title='edit.title'
          subTitle='edit.subtitle'
          id={id}
          hasStore={true}
          hasHomeEdit={true}
          hasDelete={true}
        />

        <Form
          key={`edit-general-form-${store.id}`}
          isNewStore={false}
          oldStoreData={store}
          storeCategories={storeCategories}
          storeCurrencies={storeCurrencies}
        />
      </div>
    </AnimatedPage>
  );
}
