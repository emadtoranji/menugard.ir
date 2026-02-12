import { getT } from '@i18n/server';
import Image from 'next/image';

export default async function QrCodeUsage({ lng }) {
  const { t } = await getT(lng, 'home');

  const qrCodeUrl = '/api/website-qrcode';

  return (
    <section id='qrcode' className='container my-12 py-16'>
      <div className='flex items-center gap-5 flex-col lg:flex-row'>
        <div className='w-screen lg:w-4/12 text-center mb-8 lg:mb-0'>
          <div className='p-4 rounded-4'>
            <Image
              height={200}
              width={200}
              src={qrCodeUrl}
              alt='QR Code Main Website'
              className='justify-center mx-auto shadow-lg animate__animated animate__pulse animate__slower animate__infinite'
            />
          </div>
        </div>

        <div className='w-full text-center lg:text-justify'>
          <h2 className='font-bold mb-8 text-active'>
            {t('qrcode-usage.title')}
          </h2>
          <p className='text-gray-600 leading-relaxed'>
            {t('qrcode-usage.text')}
          </p>
        </div>
      </div>
    </section>
  );
}
