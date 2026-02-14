import { getT } from '@i18n/server';

export default async function DashboardSimple({ lng }) {
  const { t } = await getT(lng, 'home');

  return (
    <section id='dashboard' className='my-12 py-16 bg-neutral-800'>
      <div className='container text-white'>
        <h2 className='font-bold mb-8 text-center'>
          {t('dashboard-simple.title')}
        </h2>
        <p className='leading-relaxed text-white/70 text-justify lg:text-center'>
          {t('dashboard-simple.text')}
        </p>
      </div>
    </section>
  );
}
