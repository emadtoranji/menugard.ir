import { getT } from '@i18n/server';

export default async function DashboardSimple({ lng }) {
  const { t } = await getT(lng, 'home');

  return (
    <section id='dashboard' className='my-12 py-16 bg-neutral-800'>
      <div className='container text-center text-white'>
        <h2 className='font-bold mb-8'>{t('dashboard-simple.title')}</h2>
        <p className='leading-relaxed opacity-80 mx-auto'>
          {t('dashboard-simple.text')}
        </p>
      </div>
    </section>
  );
}
