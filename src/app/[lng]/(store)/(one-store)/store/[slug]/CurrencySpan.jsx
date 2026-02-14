import { useT } from '@i18n/client';

export default function CurrencySpan({ storeCurrency }) {
  const { t } = useT('store');

  return (
    <span className='currency-font'>
      {t(`currencies.${storeCurrency}`, storeCurrency || '')}
    </span>
  );
}
