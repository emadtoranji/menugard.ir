import { getT } from '@i18n/server';
import Link from 'next/link';

export async function generateMetadata(props) {
  const m = await import('@utils/metadata');
  return await m.generateMetadata(props, {
    forcedPage: 'verify-email',
    robotsFollow: false,
    robotsIndex: false,
  });
}

export default async function Index({ params, searchParams }) {
  const { lng } = await params;
  const { t, lng: currentLang } = await getT(lng, 'verify-email');

  const search = await searchParams;
  let token = (await search.token) || null;
  let status = false;

  if (token) {
    const res = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
      }),
    });
    const result = await res.json();
    if (result?.ok) {
      status = true;
    }
  }

  return (
    <>
      <div className='container flex justify-center h-full my-auto'>
        <div className='card border-0 mt-10 p-10 text-2xl fw-bolder'>
          <p className={`mb-12 text-${status ? 'success' : 'danger'}`}>
            {status ? t('email-verified') : t('link-expired')}
          </p>

          <Link className='mx-auto' href={`/${currentLang}/dashboard/account`}>
            <button className='btn btn-primary w-full'>
              {t('button-title')}
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
