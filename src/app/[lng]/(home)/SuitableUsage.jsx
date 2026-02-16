import ItemImage from '@components/ItemImage';
import { getT } from '@i18n/server';
import { domPurifyServer } from '@utils/domPurifyServer';

export default async function SuitableUsage({ lng }) {
  const { t } = await getT(lng, 'home');

  const cards = [
    {
      category: 'iranian',
      title: t('suitable-usage.card1.title'),
      text: t('suitable-usage.card1.text'),
    },
    {
      category: 'coffee',
      title: t('suitable-usage.card2.title'),
      text: t('suitable-usage.card2.text'),
    },
    {
      category: 'pizza',
      title: t('suitable-usage.card3.title'),
      text: t('suitable-usage.card3.text'),
    },
  ];

  return (
    <section id='suitable' className='my-16 py-16 bg-slate-100 shadow'>
      <div className='container'>
        <div className='flex flex-wrap -m-2.5'>
          {cards.map((card, i) => (
            <div key={i} className='w-full lg:w-4/12 p-2.5'>
              <div className='bg-white rounded-lg shadow-lg h-full'>
                <div className='p-4 text-center transition-transform duration-300 hover:-translate-y-2'>
                  <ItemImage
                    key={`logo-${card.category}`}
                    category={card.category}
                    title={card.title}
                  />
                  <h4 className='mt-3 font-bold text-active'>{card.title}</h4>
                  <p
                    className='text-muted leading-relaxed'
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
