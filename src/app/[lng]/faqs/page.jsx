import { getT } from '@i18n/server';

export default async function Page({ params }) {
  const { lng } = await params;
  const { t } = await getT(lng, 'faqs');

  const faqs = t('faqs', { returnObjects: true }) || [];

  return (
    <section className='container mb-5 py-5'>
      <h1 className='fw-bold mb-4 text-center' itemProp='headline'>
        {t('faqTitle')}
      </h1>

      {faqs.length === 0 ? (
        <p className='text-center text-muted'>{t('noFaqsFound')}</p>
      ) : (
        <div className='row g-4 mt-5'>
          {faqs.map((item, idx) => (
            <div className='col-12' key={idx}>
              <h3 className='text-active fw-bold mb-2' itemProp='name'>
                {item.q}
              </h3>
              <p className='px-1 px-lg-2 px-xxl-3 lh-lg' itemProp='text'>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
