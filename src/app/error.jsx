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
      <head>
        <link
          href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css'
          integrity='sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB'
          crossOrigin='anonymous'
          rel='stylesheet'
        />
      </head>
      <body className={`container-fluid d-flex flex-column min-vh-100 m-0 p-0`}>
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
