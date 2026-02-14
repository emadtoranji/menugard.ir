import { getT } from '@i18n/server';
import { BaseUrlAddress } from '@utils/globalSettings';
import Link from 'next/link';
import CopyNewPassword from './CopyNewPassword';

export default async function CheckToken({ currentLang, token }) {
  const { t } = await getT(currentLang, 'reset-password');

  let responseData = { ok: false, message: 'LINK_IS_EXPIRED' };

  if (token) {
    try {
      const res = await fetch(BaseUrlAddress + 'api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          language: currentLang,
        }),
      });

      const data = await res.json();

      console.log(data);

      if (data.ok && data?.result?.newPassword) {
        responseData = {
          ok: true,
          message: data?.message || undefined,
          newPassword: data.result.newPassword,
        };
      }
    } catch {}
  }

  return (
    <div className='w-full'>
      <h1>
        {t(
          `code-responses.${responseData.message}`,
          t(responseData.ok ? 'new-password-title' : 'link-expired'),
        )}
      </h1>

      <h4 className='mt-3'>
        {t(
          responseData.ok
            ? 'new-password-description'
            : 'link-expired-description',
        )}
      </h4>
      {responseData?.newPassword ? (
        <div className='mt-3'>
          <CopyNewPassword newPassword={responseData.newPassword} />
        </div>
      ) : undefined}

      <div className='mt-8'>
        <Link href={`/${currentLang}/dashboard/setting`}>
          <button className='btn btn-lg btn-success w-full' type='button'>
            {t('button-route-to-dashboard-setting')}
          </button>
        </Link>
      </div>
    </div>
  );
}
