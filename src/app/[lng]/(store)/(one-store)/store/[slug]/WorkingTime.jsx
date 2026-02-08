'use client';

import { useOrder } from '@context/notes/order/useOrder';
import { useT } from '@i18n/client';
import { fallbackLng } from '@i18n/settings';
import { domPurify } from '@utils/domPurify';
import { numberToFarsi } from '@utils/numbers';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export default function WorkingTime() {
  const { t } = useT('store');
  const lng = useParams()?.lng || fallbackLng;
  const { state } = useOrder();
  const dayOfWeekNow = new Date().getDay();

  const message = useMemo(() => {
    const thisDay = (state?.store?.workingHours || []).find(
      (f) => f.dayOfWeek === dayOfWeekNow,
    );

    if (!thisDay?.id) return null;

    if (thisDay.isClosed) {
      return t('working-time.closed', '');
    }

    if (thisDay.is24Hours) {
      return t('working-time.24hour', '');
    }

    return t('working-time.open-range', {
      openTime: numberToFarsi(thisDay.openTime, lng),
      closeTime: thisDay.closeTime,
    });
  }, [state?.store?.workingHours, dayOfWeekNow, t, lng]);

  return message ? (
    <div className='asiatech-font share-tech-font fst-italic text-dark d-flex justify-content-center'>
      <span
        className='border-bottom border-dark'
        dangerouslySetInnerHTML={{ __html: domPurify(message) }}
      />
    </div>
  ) : null;
}
