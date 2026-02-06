import { useOrder } from '@context/notes/order/useOrder';
import { useT } from '@i18n/client';
import { domPurify } from '@utils/domPurify';
import { numberToFarsi } from '@utils/numbers';
import { useEffect, useState } from 'react';

export default function WorkingTime() {
  const { t, i18n } = useT('store');
  const lng = i18n.language;
  const { state } = useOrder();
  //const storeTitle = state?.store?.name || '';
  const [message, setMessage] = useState(null);
  const dayOfWeekNow = new Date().getDay();

  useEffect(() => {
    const thisDay = (state?.store?.workingHours || []).find(
      (f) => f.dayOfWeek === dayOfWeekNow,
    );

    if (thisDay?.id) {
      if (thisDay.isClosed) {
        setMessage(t('working-time.closed', ''));
      } else if (thisDay.is24Hours) {
        setMessage(t('working-time.24hour', ''));
      } else {
        const openTime = numberToFarsi(thisDay.openTime, lng);
        const closeTime = thisDay.closeTime;
        setMessage(
          t('working-time.open-range', {
            openTime,
            closeTime,
          }),
        );
      }
    } else {
      setMessage(null);
    }
  }, [state?.store?.workingHours, dayOfWeekNow]);

  return message ? (
    <div className='asiatech-font share-tech-font fst-italic text-dark d-flex justify-content-center'>
      <span
        className='border-bottom border-dark'
        dangerouslySetInnerHTML={{ __html: domPurify(message) }}
      />
    </div>
  ) : undefined;
}
