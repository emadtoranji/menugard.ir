import { fallbackLng, languages } from '@i18n/settings';
import { hardcodeWebsiteName } from './globalSettings';

export function generateHtmlEmailSingleButtons({
  language = fallbackLng,
  subject = 'DO-NOT-REPLY',
  message = '',
  buttonTitle = 'Click',
  buttonUrl = '#',
  note = '',
  footer = '',
  signature = hardcodeWebsiteName,
}) {
  language = language.toLowerCase();

  if (!languages.includes(language)) language = fallbackLng;

  return `<!DOCTYPE html><html lang="${language}" dir="${
    language === 'fa' ? 'rtl' : 'ltr'
  }"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>${subject}</title></head><body style="margin:0;padding:0;font-family:${
    language === 'fa' ? 'Vatirmatn' : ''
  } Tahoma,Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;color:#fff;background:#001731;border-radius:10px;overflow:hidden;"><tr><td style="padding:24px 20px;text-align:center"><h2 style="margin:0 0 16px 0;font-size:25px">${subject}</h2><p style="margin:0 0 24px 0;font-size:20px;line-height:1.8;">${message}</p><table cellpadding="0" cellspacing="0" align="center" style="margin:0 auto"><tr><td style="background:#2563eb;color:#fff;border-radius:6px;text-align:center"><a href="${buttonUrl}" style="color: #fff; display:inline-block; padding:14px 32px;text-decoration:none;font-size:17px;font-weight:bold">${buttonTitle}</a></td></tr></table><p style="margin:24px 0 0 0;font-size:17px;">${note}</p><p style="margin:16px 0 0 0;font-size:17px;line-height:1.7;">${footer}</p></td></tr><tr><td style="padding:14px;text-align:center;font-size:15px;background:#0d0d0d;">${signature}</td></tr></table></td></tr></table></body></html>`;
}
