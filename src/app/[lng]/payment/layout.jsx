import Main from '@components/Main';
import Footer from '../(components)/footer';
import Header from '../(components)/header';
import { getT } from '@i18n/server';

export async function generateMetadata(props) {
  const m = await import('@utils/metadata');
  return await m.generateMetadata(props, {
    forcedPage: 'payment',
    robotsFollow: false,
    robotsIndex: false,
  });
}

export default async function PaymentLayout({ children, params }) {
  const { lng } = (await params) || { lng: null };
  const { t, lng: currentLang } = await getT(lng, 'header-footer');
  return (
    <>
      <Header t={t} currentLang={currentLang} section='payment' />
      <Main>{children}</Main>
      <Footer t={t} currentLang={currentLang} />
    </>
  );
}
