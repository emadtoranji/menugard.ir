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
    <div className='card px-1 py-2 md:px-4 md:py-8'>
      {token ? (
        <CheckToken currentLang={lng} token={token} />
      ) : (
        <ResetForm hasAccess={hasAccess} currentLang={lng} />
      )}
    </div>
  );
}
