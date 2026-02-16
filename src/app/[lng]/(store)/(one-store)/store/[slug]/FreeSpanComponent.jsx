import { useT } from '@i18n/client';

export default function FreeSpanComponent({
  additionalClass = 'text-success',
}) {
  const { t } = useT('store');

  return (
    <>
      <span className='sr-only'>Free</span>
      <span className={`${additionalClass}`}>{t('free')}</span>
    </>
  );
}
