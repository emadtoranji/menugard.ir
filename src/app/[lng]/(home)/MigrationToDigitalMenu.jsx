import { getT } from '@i18n/server';

export default async function MigrationToDigitalMenu({ lng }) {
  const { t } = await getT(lng, 'home');

  return (
    <section className='container my-5 py-5'>
      <div className='row'>
        <div className='col-lg-8 mx-auto'>
          <div className='p-5 rounded-4 bg-light-subtle text-center shadow'>
            <h2 className='fw-bold mb-3'>
              {t('migration-to-digital-menu.title')}
            </h2>
            <p className='text-muted lh-lg'>
              {t('migration-to-digital-menu.text')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
