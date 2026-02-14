import hasSession from '@utils/auth/hasSession';
import { redirect } from 'next/navigation';
import { getT } from '@i18n/server';
import Header from '../(components)/header';
import Main from '@components/Main';

export async function generateMetadata(props) {
  const m = await import('@utils/metadata');
  return await m.generateMetadata(props, { forcedPage: 'dashboard' });
}

export default async function LayoutDashboard({ children, params }) {
  const hasAccess = await hasSession();
  const { lng } = (await params) || { lng: null };
  const { t, lng: currentLang } = await getT(lng, 'header-footer');

  if (!hasAccess) {
    redirect(`/${lng}/signin`);
  }

  return (
    <>
      <Header t={t} currentLang={currentLang} section='dashboard' />
      <Main>{children}</Main>
    </>
  );
}
