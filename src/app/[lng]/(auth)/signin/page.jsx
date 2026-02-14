import SignInForm from './form';
import { redirect } from 'next/navigation';
import hasSession from '@utils/auth/hasSession';

export async function generateMetadata(props) {
  const m = await import('@utils/metadata');
  return await m.generateMetadata(props, { forcedPage: 'signin' });
}

export default async function Index({ params }) {
  const hasAccess = await hasSession();
  if (hasAccess) {
    const { lng } = await params;
    redirect(`/${lng}/dashboard`);
  }

  const enabledLoginProviders = [
    { id: 'github', class: '', file: 'github.svg' },
    { id: 'google', class: '', file: 'google.svg' },
    { id: 'twitter', class: '', file: 'x.png' },
  ].filter((p) => process.env[`AUTH_${p.id.toUpperCase()}_ID`]);

  return <SignInForm enabledLoginProviders={enabledLoginProviders} />;
}
