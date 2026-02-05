import Main from '@components/Main';

export async function generateMetadata(props) {
  const m = await import('@utils/metadata');
  return m.generateMetadata(props, { forcedPage: 'storeSlug' });
}

export default async function Layout({ children }) {
  return (
    <>
      <Main customClass={'store-section mb-5'}>{children}</Main>
    </>
  );
}
