'use client';

import { useT } from '@i18n/client';
import { fallbackLng } from '@i18n/settings';
import { numberToFarsi } from '@utils/numbers';
import { useParams } from 'next/navigation';

export default function FooterMessageYear() {
  const { t } = useT('header-footer');
  const lng = useParams()?.lng || fallbackLng;

  let year;

  if (lng === 'fa') {
    year = new Date().toLocaleDateString('fa-IR-u-ca-persian', {
      year: 'numeric',
    });
  } else {
    year = new Date().getFullYear();
  }
  return (
    <p className='mb-0 small'>
      {t('footer.copy', {
        year: numberToFarsi(year, lng),
      })}
    </p>
  );
  return;
}
