import Main from '@components/Main';
import Footer from '../(components)/footer';

export async function generateMetadata(props) {
  const m = await import('@utils/metadata');
  return m.generateMetadata(props, { forcedPage: 'home' });
}

export default async function Layout({ children, params }) {
  const { lng } = (await params) || { lng: null };

  return (
    <>
      <Main>{children}</Main>
      <Footer lng={lng} />
    </>
  );
}
