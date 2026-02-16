import { getT } from '@i18n/server';
import { domPurifyServer } from '@utils/domPurifyServer';
import Image from 'next/image';

export default async function SearchEngines({ lng }) {
  const { t } = await getT(lng, 'home');
  const imageClasses = `transition-transform duration-300 hover:-translate-y-3 p-1 bg-white mx-auto animate__animated animate__infinite animate__slower`;

  return (
    <section
      id='search-engine'
      className='container bg-white shadow-xl mt-24 mb-40 py-8 rounded'
    >
      <div className='text-center mb-16'>
        <h2 className='grid sm:flex justify-center gap-2 font-bold text-active mb-4'>
          <span>{t('search-engine.title-1')}</span>
          <Image
            height={50}
            width={50}
            alt='rocket'
            src={'/images/home/rocket.svg'}
            style={{ '--animate-duration': '3s' }}
            className='animate__animated animate__bounce animate__infinite animate__slower hidden sm:flex'
          />
          <span>{t('search-engine.title-2')}</span>
        </h2>
        <h3
          className='font-normal'
          dangerouslySetInnerHTML={{
            __html: domPurifyServer(t('search-engine.text')),
          }}
        />
      </div>

      <div className='flex flex-wrap justify-center gap-4'>
        <Image
          height={75}
          width={75}
          src={'/images/home/google.svg'}
          alt='google'
          style={{ '--animate-duration': '1s' }}
          className={`${imageClasses} animate__pulse`}
        />
        <Image
          height={75}
          width={75}
          src={'/images/home/bing.svg'}
          alt='bing'
          style={{ '--animate-duration': '2.5s' }}
          className={`${imageClasses} animate__swing`}
        />
        <Image
          height={75}
          width={75}
          src={'/images/home/chatgpt.png'}
          alt='chatgpt'
          style={{ '--animate-duration': '1s' }}
          className={`${imageClasses} animate__pulse`}
        />
        <Image
          height={75}
          width={75}
          src={'/images/home/yahoo.svg'}
          alt='yahoo'
          style={{ '--animate-duration': '3.5s' }}
          className={`${imageClasses} animate__swing`}
        />
        <Image
          height={75}
          width={75}
          src={'/images/home/grok.webp'}
          alt='grok'
          style={{ '--animate-duration': '2s' }}
          className={`${imageClasses} animate__pulse`}
        />
      </div>
    </section>
  );
}
