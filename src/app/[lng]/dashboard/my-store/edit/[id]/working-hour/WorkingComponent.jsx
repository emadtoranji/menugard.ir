'use client';

import { useState } from 'react';
import { validateWorkingHours } from '@utils/dashboard/store/validation/dayOfWeekValidation';
import { toast } from 'react-hot-toast';
import { useT } from '@i18n/client';
import Spinner from '@components/Spinner';

function sortDays(days) {
  const order = [6, 0, 1, 2, 3, 4, 5];
  return [...days].sort(
    (a, b) => order.indexOf(a.dayOfWeek) - order.indexOf(b.dayOfWeek),
  );
}

function createDefaultDays(existing) {
  if (existing?.length === 7) return sortDays(existing);

  const defaults = [0, 1, 2, 3, 4, 5, 6].map((i) => ({
    dayOfWeek: i,
    openTime: '09:00',
    closeTime: '17:00',
    isClosed: false,
    is24Hours: false,
  }));

  return sortDays(defaults);
}

export default function WorkingComponent({ store }) {
  const { t } = useT('dashboard-my-store');

  const DAY_LABELS = {
    0: t('day-of-week.sunday'),
    1: t('day-of-week.monday'),
    2: t('day-of-week.tuesday'),
    3: t('day-of-week.wednesday'),
    4: t('day-of-week.thursday'),
    5: t('day-of-week.friday'),
    6: t('day-of-week.saturday'),
  };

  const [days, setDays] = useState(createDefaultDays(store?.workingHours));
  const [errors, setErrors] = useState({});
  const [isSubmiting, setIsSubmiting] = useState(false);

  function setMode(index, mode) {
    setDays((prev) => {
      const next = [...prev];

      next[index] = {
        ...next[index],
        isClosed: mode === 'closed',
        is24Hours: mode === '24h',
        openTime: mode === 'custom' ? (next[index].openTime ?? '09:00') : null,
        closeTime:
          mode === 'custom' ? (next[index].closeTime ?? '17:00') : null,
      };

      return next;
    });

    setErrors((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  }

  function updateTime(index, key, value) {
    setDays((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });

    setErrors((prev) => {
      if (!prev[index]) return prev;
      return {
        ...prev,
        [index]: {
          ...prev[index],
          [key]: false,
        },
      };
    });
  }

  async function submit() {
    setErrors({});

    const validationErrors = validateWorkingHours(days);
    if (validationErrors) {
      setErrors(validationErrors);
      toast.error(t('code-responses.FORM_HAS_ERRORS'));
      return;
    }

    setIsSubmiting(true);
    try {
      const res = await fetch('/api/dashboard/store/store-working-hour', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: store.id,
          workingHours: days,
        }),
      });

      const result = await res.json();
      result?.ok
        ? toast.success(t('edit.updated-successfully'))
        : toast.error(
            t(`code-responses.${result?.message}`) ||
              t('general.unknown-problem'),
          );
    } catch {
      toast.error(t('general.unknown-problem'));
    } finally {
      setIsSubmiting(false);
    }
  }

  return (
    <div className='row g-4'>
      {days.map((day, index) => (
        <div key={day.dayOfWeek} className='col-12 col-md-6 col-xl-4'>
          <div className='card h-100 shadow border-0 rounded'>
            <div className='card-header fw-semibold'>
              {DAY_LABELS[day.dayOfWeek]}
            </div>

            <div className='card-body d-flex flex-column gap-3'>
              <div className='d-flex justify-content-between align-items-center gap-2 flex-wrap'>
                <button
                  className={`btn btn-sm col ${
                    day.isClosed ? 'btn-active' : 'btn-secondary'
                  }`}
                  onClick={() => setMode(index, 'closed')}
                >
                  {t('edit.sections.working-hour.closed')}
                </button>

                <button
                  className={`btn btn-sm col ${
                    day.is24Hours ? 'btn-active' : 'btn-secondary'
                  }`}
                  onClick={() => setMode(index, '24h')}
                >
                  {t('edit.sections.working-hour.24-hour')}
                </button>

                <button
                  className={`btn btn-sm col ${
                    !day.isClosed && !day.is24Hours
                      ? 'btn-active'
                      : 'btn-secondary'
                  }`}
                  onClick={() => setMode(index, 'custom')}
                >
                  {t('edit.sections.working-hour.custom-hour')}
                </button>
              </div>

              {!day.isClosed && !day.is24Hours && (
                <div className='border rounded p-3'>
                  <div className='row g-2'>
                    <div className='col-6'>
                      <label className='form-label small'>
                        {t('edit.sections.working-hour.start-time')}
                      </label>
                      <input
                        type='time'
                        className={`form-control ${
                          errors?.[index]?.openTime ? 'is-invalid' : ''
                        }`}
                        value={day.openTime || ''}
                        onChange={(e) =>
                          updateTime(index, 'openTime', e.target.value)
                        }
                      />
                    </div>

                    <div className='col-6'>
                      <label className='form-label small'>
                        {t('edit.sections.working-hour.end-time')}
                      </label>
                      <input
                        type='time'
                        className={`form-control ${
                          errors?.[index]?.closeTime ? 'is-invalid' : ''
                        }`}
                        value={day.closeTime || ''}
                        onChange={(e) =>
                          updateTime(index, 'closeTime', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {day.isClosed && (
                <div className='mt-3 small'>
                  {t('edit.sections.working-hour.store-is-closed-in-this-day')}
                </div>
              )}

              {day.is24Hours && (
                <div className='mt-3 small'>
                  {t('edit.sections.working-hour.store-is-24-hour-open')}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className='col-12'>
        <button
          className='btn btn-lg btn-success px-5 w-100'
          onClick={submit}
          disabled={isSubmiting}
        >
          {isSubmiting ? <Spinner /> : t('edit.update-button')}
        </button>
      </div>
    </div>
  );
}
