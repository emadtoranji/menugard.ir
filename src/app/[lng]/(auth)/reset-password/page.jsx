import ResetForm from './ResetForm';
import CheckToken from './CheckToken';
import hasSession from '@utils/auth/hasSession';

export async function generateMetadata(props) {
  const m = await import('@utils/metadata');
  return await m.generateMetadata(props, {
    forcedPage: 'reset-password',
    robotsFollow: false,
    robotsIndex: false,
  });
}

export default async function ResetPassword({ params, searchParams }) {
  const { lng } = await params;
  const hasAccess = await hasSession();

  const { token = undefined } = await searchParams;

  return (
    <div className='container w-full md:w-8/10 lg:w-7/10 xl:w-6/10 xxl:w-5/10 '>
      <div className='flex items-center justify-center card mt-5 px-4 md:px-6 lg:px-8 xl:px-10 py-16'>
        {token ? (
          <CheckToken currentLang={lng} token={token} />
        ) : (
          <ResetForm hasAccess={hasAccess} currentLang={lng} />
        )}
      </div>
    </div>
  );
}
