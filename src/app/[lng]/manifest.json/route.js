import { getT } from '@i18n/server';
import { BaseUrlAddress, MainBackgroundColor } from '@utils/globalSettings';

const CLEAR_CACHE_VERSION = '?v=' + process.env.NEXT_PUBLIC_CLEAR_CACHE_VERSION;

export async function GET(request, { params }) {
  const { lng } = (await params) || { lng: null };
  const { t: CommonT } = await getT(lng);
  const { t } = await getT(lng, 'meta');
  const keywords = t('general.keywords', { returnObjects: true });
  const AppName = CommonT('general.app-name', '');
  const response = {
    name: t('general.title', { AppName }),
    short_name: t('general.title', {
      AppName,
    }),
    description: t('general.description', {
      AppName,
    }),
    lang: lng,
    start_url: '/',
    display: 'standalone',
    scope: '/',
    orientation: 'portrait',
    background_color: MainBackgroundColor,
    theme_color: MainBackgroundColor,
    icons: [
      {
        src:
          BaseUrlAddress +
          'images/icons/16/app-logo.webp' +
          CLEAR_CACHE_VERSION,
        sizes: '16x16',
        type: 'image/webp',
      },
      {
        src:
          BaseUrlAddress +
          'images/icons/32/app-logo.webp' +
          CLEAR_CACHE_VERSION,
        sizes: '32x32',
        type: 'image/webp',
      },
      {
        src:
          BaseUrlAddress +
          'images/icons/180/app-logo.webp' +
          CLEAR_CACHE_VERSION,
        sizes: '180x180',
        type: 'image/webp',
      },
      {
        src:
          BaseUrlAddress +
          'images/icons/512/app-logo.webp' +
          CLEAR_CACHE_VERSION,
        sizes: '512x512',
        type: 'image/webp',
      },
    ],
    categories: Array.isArray(keywords) ? keywords : [],
    related_applications: [],
    prefer_related_applications: false,
  };

  return Response.json(response, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=2678400, immutable',
    },
  });
}
