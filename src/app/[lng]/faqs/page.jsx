import { getT } from '@i18n/server';

export default async function Page({ params }) {
  const { lng } = await params;
  const { t } = await getT(lng, 'faqs');

  const faqs = t('faqs', { returnObjects: true }) || [];

  return (
    <section className='container mb-5 py-16'>
      <h1 className='font-bold mb-12 text-center' itemProp='headline'>
        {t('faqTitle')}
      </h1>

      {faqs.length === 0 ? (
        <p className='text-center text-xl text-gray-600'>{t('noFaqsFound')}</p>
      ) : (
        <div className='mt-10'>
          {faqs.map((item, idx) => (
            <div className='w-full mb-10' key={idx}>
              <h3 className='text-active font-bold mb-2' itemProp='name'>
                {item.q}
              </h3>
              <p className='px-1 lg:px-4 2xl:px-6 text-xl' itemProp='text'>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
