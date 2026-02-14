import { getT } from '@i18n/server';

export default async function ServiceNotFound({ lng }) {
  const { t } = await getT(lng, 'store');

  return (
    <div className='container'>
      <h2 className='mt-5 font-bold'>{t('empty')}</h2>
    </div>
  );
}
