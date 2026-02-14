import Main from '@components/Main';
import { getT } from '@i18n/server';
import Header from '../(components)/header';

export async function generateMetadata(props) {
  const m = await import('@utils/metadata');
  return await m.generateMetadata(props, { forcedPage: 'signin' });
}

export default async function layout({ children, params }) {
  const { lng } = (await params) || { lng: null };
  const { t, lng: currentLang } = await getT(lng, 'header-footer');

  return (
    <>
      <Header t={t} currentLang={currentLang} section='auth' />
      <Main customClass={'max-w-5xl m-auto'}>
        <section className='container m-auto mt-8'>{children}</section>
      </Main>
    </>
  );
}
