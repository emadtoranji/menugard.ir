import Main from '@components/Main';

export async function generateMetadata(props) {
  const m = await import('@utils/metadata');
  return await m.generateMetadata(props, { forcedPage: 'storeSlug' });
}

export default async function Layout({ children }) {
  return (
    <>
      <Main customClass={'my-0'}>{children}</Main>
    </>
  );
}
