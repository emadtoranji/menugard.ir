import { getT } from '@i18n/server';
import { BaseUrlAddress } from '@utils/globalSettings';
import Image from 'next/image';
import QRCode from 'qrcode';

export default async function QrCodeUsage({ lng }) {
  const { t } = await getT(lng, 'home');

  const qrDataUrl = await QRCode.toDataURL(BaseUrlAddress, {
    width: 200,
    margin: 2,
  });

  return (
    <section id='qrcode' className='container my-5 py-5'>
      <div className='row align-items-center flex-column flex-lg-row'>
        <div className='col-lg-3 text-center mb-4 mb-lg-0'>
          <div className='d-inline-block p-4 rounded-4'>
            <Image
              height={200}
              width={200}
              src={qrDataUrl}
              alt='QR Code Main Website'
              className='img-fluid shadow'
            />
          </div>
        </div>

        <div className='col text-justify'>
          <h2 className='fw-bold mb-4 text-active'>
            {t('qrcode-usage.title')}
          </h2>
          <p className='text-muted lh-lg'>{t('qrcode-usage.text')}</p>
        </div>
      </div>
    </section>
  );
}
