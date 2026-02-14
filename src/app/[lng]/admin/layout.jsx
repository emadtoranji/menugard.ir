import Main from '@components/Main';
import { getT } from '@i18n/server';
import { auth } from '@utils/auth/NextAuth';
import { redirect } from 'next/navigation';
import Header from '../(components)/header';

export async function generateMetadata(props) {
  const m = await import('@utils/metadata');
  return await m.generateMetadata(props, {
    forcedPage: 'admin',
    robotsFollow: false,
    robotsIndex: false,
  });
}

export default async function layoutAdmin({ children, params }) {
  const session = await auth();
  const userId = session?.user?.id;
  const accessibility = session?.user?.accessibility;
  const { lng } = (await params) || { lng: null };
  const { t, lng: currentLang } = await getT(lng, 'header-footer');
  if (!userId || !['admin', 'developer'].includes(accessibility)) {
    redirect(`/${lng}/signin`);
  }

  return (
    <>
      <Header t={t} currentLang={currentLang} section='admin' />
      <Main>{children}</Main>
    </>
  );
}
