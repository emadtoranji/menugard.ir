import { getT } from '@i18n/server';

export default async function ServiceDisabled({ lng }) {
  const { t } = await getT(lng, 'store');

  return (
    <div className='container'>
      <span className='sr-only'>Store Is Disabled</span>
      <h2 className='mt-5 font-bold'>{t('store-disabled')}</h2>
    </div>
  );
}
