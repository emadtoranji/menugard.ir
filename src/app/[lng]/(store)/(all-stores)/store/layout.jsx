import { getT } from '@i18n/server';
import Main from '@components/Main';
import Header from '@app/[lng]/(components)/header';
import Footer from '@app/[lng]/(components)/footer';

export async function generateMetadata(props) {
  const m = await import('@utils/metadata');
  return await m.generateMetadata(props, { forcedPage: 'store' });
}

export default async function Layout({ children, params }) {
  const { lng } = (await params) || { lng: null };
  const { t, lng: currentLang } = await getT(lng, 'header-footer');
  return (
    <>
      <Header t={t} currentLang={currentLang} section='store' />
      <Main customClass={''}>{children}</Main>
      <Footer t={t} lng={currentLang} />
    </>
  );
}
