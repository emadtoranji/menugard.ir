import '@styles/general/globals.css';
import 'animate.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Roboto, Vazirmatn, Share_Tech } from 'next/font/google';
import { fallbackLng, languages } from '@i18n/settings';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';

import localFont from 'next/font/local';

const asiatech = localFont({
  subsets: ['arabic'],
  src: '../fonts/asiatech.ttf',
  display: 'swap',
  variable: '--font-asiatech',
  style: 'normal',
});

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-vazirmatn',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-roboto',
});

const shareTech = Share_Tech({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-share-tech',
});

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default async function RootLayout({ children, params }) {
  const { lng } = await params;
  const isRTL = ['fa', 'ar'].includes(
    (String(lng) || fallbackLng).toLowerCase(),
  );

  return (
    <html
      lang={lng}
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`w-full box-border overflow-x-hidden m-0 p-0 ${
        isRTL
          ? `${vazirmatn.variable} ${asiatech.variable}`
          : `${roboto.variable} ${shareTech.variable}`
      }`}
    >
      <body
        className={`flex flex-col min-h-screen w-full box-border overflow-x-hidden m-0 p-0`}
      >
        <Toaster />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
