export const hardcodeWebsiteName = 'MenuGard';

let __NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '/';
let __NEXT_PUBLIC_BASE_CLIENT_API_URL =
  process.env.NEXT_PUBLIC_BASE_CLIENT_API_URL || '/';
let API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/';

let __PAYMENT_GATEWAY_CALLBACK_URL =
  process.env.PAYMENT_GATEWAY_CALLBACK_URL || '';

export const BaseUrlAddress = __NEXT_PUBLIC_BASE_URL.endsWith('/')
  ? __NEXT_PUBLIC_BASE_URL
  : __NEXT_PUBLIC_BASE_URL + '/';

export const BASE_CLIENT_API_URL = __NEXT_PUBLIC_BASE_CLIENT_API_URL.endsWith(
  '/',
)
  ? __NEXT_PUBLIC_BASE_CLIENT_API_URL
  : __NEXT_PUBLIC_BASE_CLIENT_API_URL + '/';

export const PAYMENT_GATEWAY_CALLBACK_URL =
  __PAYMENT_GATEWAY_CALLBACK_URL.endsWith('/')
    ? __PAYMENT_GATEWAY_CALLBACK_URL
    : __PAYMENT_GATEWAY_CALLBACK_URL + '/';

export const ApiUrlAddress =
  BaseUrlAddress + API_URL.endsWith('/') ? API_URL : API_URL + '/';

export const MainBackgroundColor = '#e7cbcb';

export const isProduction = process.env.NODE_ENV === 'production';

export const MAX_EMAIL_LENGTH = 254;
export const MAX_PASSWORD_LENGTH = 128;

export const MAIN_CURRENCY = process.env.NEXT_PUBLIC_MAIN_CURRENCY || null;

export const TimeZone = 'Asia/Tehran';

export const iranianGatewayAmountRange = {
  min: 20_000,
  max: 50_000_000,
  currency: 'irt',
};

export const allGateways = [
  {
    id: 'IRANIAN',
    liveCheck: true,
    active: false,
    title: 'dashboard.finance.rial',
  },
  {
    id: 'CRYPTOCURRENCY',
    liveCheck: true,
    active: false,
    title: 'dashboard.finance.crypto',
  },
  {
    id: 'TRANSFER-IRANIAN-CARD',
    liveCheck: false,
    active: true,
    title: 'dashboard.finance.transfer-iranian-card',
  },
];

export const CRON_SECRET = process.env.CRON_SECRET;

export const CLEAR_CACHE_VERSION = process.env.NEXT_PUBLIC_CLEAR_CACHE_VERSION;

export const MAXIMUM_STORE_LIMIT_EXCESSES = 100;

export const STORE_CONTEXT_HOURS_FRESH = 3;
