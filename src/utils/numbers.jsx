import crypto from 'crypto';

const faDigitsArabic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const faDigitsPersian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function numberToFarsi(text, language) {
  if (String(language).toLowerCase() === 'fa') {
    let result = String(text);

    for (let i = 0; i <= 9; i++) {
      const regexPersian = new RegExp(i, 'g');
      result = result.replace(regexPersian, faDigitsPersian[i]);

      const regexArabic = new RegExp(i, 'g');
      result = result.replace(regexArabic, faDigitsArabic[i]);
    }

    return result;
  }

  return text;
}

export function numberToEnglish(text) {
  let result = String(text);

  for (let i = 0; i <= 9; i++) {
    const regexArabic = new RegExp(faDigitsArabic[i], 'g');
    result = result.replace(regexArabic, i);

    const regexPersian = new RegExp(faDigitsPersian[i], 'g');
    result = result.replace(regexPersian, i);
  }

  return result;
}

export function formatNumber(value, language = null, span = false) {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;

  const str = numberToEnglish(String(num));
  const [integer, decimal = ''] = str.split('.');

  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '٬');
  const trimmedDecimal = decimal.slice(0, 6);

  if (span) {
    return (
      <span className=''>
        <span>{numberToFarsi(grouped, language)}</span>
        {trimmedDecimal && (
          <span className='opacity-50'>
            .{numberToFarsi(trimmedDecimal, language)}
          </span>
        )}
      </span>
    );
  }

  const result = trimmedDecimal ? `${grouped}.${trimmedDecimal}` : grouped;

  return numberToFarsi(result, language);
}

export function exportOnlyNumberFromString({ value, float = false }) {
  if (value === null || value === undefined) return 0;

  const normalized = numberToEnglish(String(value));

  const regex = float ? /[^0-9.-]/g : /[^0-9-]/g;

  const cleaned = normalized.replace(regex, '');

  const result = float ? parseFloat(cleaned) : parseInt(cleaned, 10);

  return Number.isNaN(result) ? 0 : result;
}

export function showDollarCompactFormat(
  count,
  fixCount = 2,
  withSpan = true,
  currency = '',
  t,
) {
  count = numberToEnglish(count);
  if (!isFinite(count)) {
    return '--';
  }

  const scales = [
    { limit: 1e9, divisor: 1e9, symbol: t('general.billion', 'B') },
    { limit: 1e6, divisor: 1e6, symbol: t('general.million', 'M') },
    { limit: 1e3, divisor: 1e3, symbol: t('general.kilo', 'K') },
    { limit: 0, divisor: 1, symbol: '' },
  ];

  for (const scale of scales) {
    if (count >= scale.limit) {
      return withSpan ? (
        <div className='flex items-center gap-1'>
          <span className='persian-gulf-font' style={{ fontFamily: 'a' }}>
            {(count / scale.divisor).toFixed(fixCount)}
          </span>
          <span className='opacity-100 flex items-center gap-1 '>
            <span className='text-xl persian-gulf-font'>{scale.symbol}</span>
            <span className='text-xl persian-gulf-font'>{currency}</span>
          </span>
        </div>
      ) : (
        (count / scale.divisor).toFixed(fixCount) + scale.symbol
      );
    }
  }

  if (count >= 1e12) {
    return (count / 1e12).toFixed(fixCount) + 'T';
  }

  return count.toString();
}

export function daysToSecond(day) {
  return day * 86400;
}

export function hourToSecond(hour) {
  return hour * 3600;
}

export const generateVerifyToken = () => crypto.randomBytes(32).toString('hex');
