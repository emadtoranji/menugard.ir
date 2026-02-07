import QRCode from 'qrcode';
import { BaseUrlAddress } from '@utils/globalSettings';

export async function GET(req) {
  const qrDataUrl = await QRCode.toDataURL(BaseUrlAddress, {
    width: 200,
    margin: 2,
  });

  const base64 = qrDataUrl.split(',')[1];
  const buffer = Buffer.from(base64, 'base64');

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=2592000',
    },
  });
}
