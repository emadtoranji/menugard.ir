import { getT } from '@i18n/server';

export default async function DashboardSimple({ lng }) {
  const { t } = await getT(lng, 'home');

  return (
    <section className='my-5 py-5 bg-dark text-light'>
      <div className='container text-center'>
        <h2 className='fw-bold mb-4'>{t('dashboard-simple.title')}</h2>
        <p className='lh-lg text-white text-opacity-75 mx-auto'>
          {t('dashboard-simple.text')}
        </p>
      </div>
    </section>
  );
}
