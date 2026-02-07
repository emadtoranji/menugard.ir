import { getT } from '@i18n/server';
import { domPurifyServer } from '@utils/domPurifyServer';

export default async function SuitableUsage({ lng }) {
  const { t } = await getT(lng, 'home');

  const cards = [
    {
      icon: 'bi-cup-hot text-success',
      title: t('suitable-usage.card1.title'),
      text: t('suitable-usage.card1.text'),
    },
    {
      icon: 'bi-shop text-warning',
      title: t('suitable-usage.card2.title'),
      text: t('suitable-usage.card2.text'),
    },
    {
      icon: 'bi-basket text-danger',
      title: t('suitable-usage.card3.title'),
      text: t('suitable-usage.card3.text'),
    },
  ];

  return (
    <section id='suitable' className='my-5 py-5 bg-body-tertiary shadow'>
      <div className='container'>
        <div className='row g-4'>
          {cards.map((card, i) => (
            <div key={i} className='col-lg-4'>
              <div className='card h-100 border-0 shadow'>
                <div className='card-body text-center'>
                  <i className={`bi fs-3 ${card.icon}`}></i>
                  <h4 className='mt-3 fw-bold text-active'>{card.title}</h4>
                  <p
                    className='text-muted lh-lg'
                    dangerouslySetInnerHTML={{
                      __html: domPurifyServer(card.text),
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
