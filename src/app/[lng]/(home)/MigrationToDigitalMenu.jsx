import { getT } from '@i18n/server';

export default async function MigrationToDigitalMenu({ lng }) {
  const { t } = await getT(lng, 'home');

  return (
    <section id='migration' className='container my-12 py-16'>
      <div className='lg:w-10/12 mx-auto'>
        <div className='py-16 px-8 rounded-4 bg-white rounded-lg shadow-2xl'>
          <h2 className='font-bold mb-3 text-active text-center'>
            {t('migration-to-digital-menu.title')}
          </h2>
          <p className='text-gray-600 leading-relaxed text-justify lg:text-center'>
            {t('migration-to-digital-menu.text')}
          </p>
        </div>
      </div>
    </section>
  );
}
