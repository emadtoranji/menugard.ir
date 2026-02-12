import { getT } from '@i18n/server';

export default async function ServiceDisabled({ lng }) {
  const { t } = await getT(lng, 'store');

  return (
    <div className='container'>
      <div className='mt-5 lead font-bold'>{t('store-disabled')}</div>
    </div>
  );
}
