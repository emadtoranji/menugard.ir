import Main from '@components/Main';
import Footer from '../(components)/footer';
import Header from '../(components)/header';
import { getT } from '@i18n/server';

export async function generateMetadata(props) {
  const m = await import('@utils/metadata');
  return m.generateMetadata(props, { forcedPage: 'faqs' });
}

export default async function Layout({ children, params }) {
  const { lng } = (await params) || { lng: null };
  const { t } = await getT(lng, 'header-footer');

  return (
    <>
      <Header t={t} currentLang={lng} />
      <Main>{children}</Main>
      <Footer lng={lng} />
    </>
  );
}
