'use client';

import { useT } from '@i18n/client';
import { fallbackLng } from '@i18n/settings';
import Problems from '@components/Problems';
import { useParams } from 'next/navigation';

export default function Error({ error, reset }) {
  const { t } = useT('error');
  const lng = useParams()?.lng || fallbackLng;

  const content = {
    title: t('error.title'),
    button: t('error.button'),
  };

  return (
    <html lang={'auto'} dir={'auto'}>
      <body className={`container-fluid flex flex-col min-w-full m-0 p-0`}>
        <Problems
          content={content}
          code={500}
          currentLang={lng}
          message={
            process.env.NODE_ENV === 'production' ? '' : error?.message || ''
          }
        />
      </body>
    </html>
  );
}
