import { getT } from '@i18n/server';
import { languages } from '@i18n/settings';
import { BaseUrlAddress, hardcodeWebsiteName } from '@utils/globalSettings';
import prisma from '@lib/prisma';

const site = {
  name: hardcodeWebsiteName,
  domain: BaseUrlAddress,
  twitter: '',
};

const CLEAR_CACHE_VERSION = '?v=' + process.env.NEXT_PUBLIC_CLEAR_CACHE_VERSION;

const buildUrl = (path = '') => `${site.domain}${path}`;

const extractPageName = (params, forcedPage) => {
  if (forcedPage) return forcedPage;
  if (!params || typeof params !== 'object') return 'home';

  const values = Object.values(params).filter(Boolean);

  if (values.length <= 1) return 'home';

  return values[1];
};

const imageBySize = (size) => {
  if (!size) return `images/app-logo.webp${CLEAR_CACHE_VERSION}`;
  return `images/icons/${size}/app-logo.webp${CLEAR_CACHE_VERSION}`;
};

const merge = (page = {}, general = {}) => ({
  title: page?.title || general?.title || site?.name || '',
  description: page?.description || general?.description || '',
  keywords: page?.keywords || general?.keywords || [],
  category: page?.category || general?.category || 'General',
});

export async function generateMetadata(
  { params },
  { forcedPage = null, robotsFollow = true, robotsIndex = true } = {},
) {
  const resolvedParams = await params;

  if (!resolvedParams || typeof resolvedParams !== 'object') {
    return {};
  }

  const { lng, slug } = resolvedParams;

  const { t: tMeta, lng: currentLang } = await getT(lng, 'meta');
  const commonT = (await getT(currentLang)).t;

  let pageName = extractPageName(resolvedParams, forcedPage);

  if (forcedPage === 'storeSlug' && slug) {
    pageName = 'storeSlug';
  }

  const general = tMeta('general', { returnObjects: true }) || {};
  const page = tMeta(pageName, { returnObjects: true }) || {};

  let meta = merge(page, general);

  const AppName = commonT('general.app-name');
  meta.title = String(meta.title).replace('{{AppName}}', AppName);
  meta.description = String(meta.description).replace('{{AppName}}', AppName);

  if (Array.isArray(meta.keywords)) {
    meta.keywords = meta.keywords.map((keyword) =>
      String(keyword).replace('{{AppName}}', AppName),
    );
  }

  if (pageName === 'storeSlug' && slug) {
    const storeData = await prisma.store.findFirst({
      select: { name: true, description: true, categories: true },
      where: { slug },
    });
    if (storeData?.name) {
      meta.title = `${storeData.name} | ${AppName}`;
    }
    if (storeData?.keywords) {
      meta.keywords = (storeData?.categories || []).map((category) => category);
    }
    if (storeData?.description) {
      meta.description = storeData.description;
    }
  }

  const canonicalPath =
    pageName === 'home' ? currentLang : `${currentLang}/${pageName}`;
  const canonical = buildUrl(canonicalPath);

  const image1200 = buildUrl(imageBySize(1200));
  const image512 = buildUrl(imageBySize(512));
  const image180 = buildUrl(imageBySize(180));
  const image32 = buildUrl(imageBySize(32));
  const image16 = buildUrl(imageBySize(16));

  const alternates = {};
  for (const l of languages) {
    const altPath = pageName === 'home' ? l : `${l}/${pageName}`;
    alternates[l] = buildUrl(altPath);
  }

  return {
    metadataBase: new URL(site.domain),

    title: {
      default: meta.title,
      template: '%s',
    },

    description: meta.description,
    keywords: meta.keywords,
    category: meta.category,

    themeColor: site.themeColor,
    manifest: `/${currentLang}/manifest.json${CLEAR_CACHE_VERSION}`,

    alternates: {
      canonical,
      languages: alternates,
    },

    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      siteName: site.name,
      type: 'website',
      locale: currentLang,
      images: [
        {
          url: image1200,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [image1200],
      site: site.twitter,
    },

    icons: {
      icon: [
        { url: image32, sizes: '32x32' },
        { url: image16, sizes: '16x16' },
      ],
      apple: [{ url: image180, sizes: '180x180' }],
    },

    robots: {
      index: robotsIndex,
      follow: robotsFollow,
      nocache: false,
      googleBot: {
        index: robotsIndex,
        follow: robotsFollow,
        noimageindex: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },

    meta: [
      { charSet: 'UTF-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { httpEquiv: 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'author', content: 'Emad Toranji' },
      { name: 'theme-color', content: 'var(--bg-main)' },
    ],

    applicationName: site.name,
    creator: site.name,
    publisher: site.name,
  };
}
