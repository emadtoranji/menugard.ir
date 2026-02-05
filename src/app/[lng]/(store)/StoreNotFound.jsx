import { getT } from '@i18n/server';

export default async function ServiceNotFound({ lng }) {
  const { t } = await getT(lng, 'store');

  return (
    <div className='container'>
      <div className='mt-5 lead fw-bold'>{t('empty')}</div>
    </div>
  );
}
