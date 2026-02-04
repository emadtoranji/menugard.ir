import { useT } from '@i18n/client';
import { freeSpanComponent } from './FreeSpan';
import { formatNumber } from '@utils/numbers';
import { useEffect, useState } from 'react';

export default function ItemOption({ lng, options = [], isOrderable = true }) {
  const { t } = useT('store');
  if (!options.length) return null;

  const additionalClass = 'm-auto fs-7';
  const freeSpan = freeSpanComponent({ t, additionalClass });

  const [optionCounts, setOptionCounts] = useState({});

  useEffect(() => {
    const initialState = {};
    options.forEach((option, index) => {
      initialState[index] = option?.minSelect || 0;
    });
    setOptionCounts(initialState);
  }, [options]);

  function handleOptionSelect({ index, minSelect, maxSelect, change }) {
    setOptionCounts((prev) => {
      const current = prev[index] ?? minSelect;
      const next = Math.min(maxSelect, Math.max(minSelect, current + change));
      return { ...prev, [index]: next };
    });
  }

  return (
    <div className='border-top mt-2 pt-2 w-100 row row-cols-1 g-1 px-1'>
      {options.map((option, index) => {
        if (!option?.title) return null;

        const isOrderableOption = isOrderable ? option?.isActive : false;
        const minSelect = option.minSelect ?? 0;
        const maxSelect = option.maxSelect ?? 1;
        const count = optionCounts[index] ?? minSelect;

        const atMin = count <= minSelect;
        const atMax = count >= maxSelect;

        const isSimpleAdd =
          (minSelect === 0 || minSelect === 1) && maxSelect === 1;

        const priceSection = !isNaN(option.priceChangePercent) ? (
          option.priceChangePercent === 0 ? (
            <span className={additionalClass}>
              (<span>{freeSpan}</span>)
            </span>
          ) : (
            <bdi dir='ltr' className={`${additionalClass} fw-bolder`}>
              ({option.priceChangePercent > 0 ? '+' : ''}
              {formatNumber(option.priceChangePercent, lng)}
              {t('general.percent')})
            </bdi>
          )
        ) : null;

        return (
          <div
            key={`item-option-${index}`}
            className='d-flex align-items-center justify-content-between'
          >
            <h6 className='d-flex align-items-baseline gap-1 m-0'>
              {option.isRequired && (
                <i className='fs-10 bi bi-asterisk text-danger'></i>
              )}
              <span>{option.title}</span>
              {priceSection}
            </h6>

            {!isOrderableOption ? (
              <button type='button' className='btn btn-danger btn-sm' disabled>
                {t('is-not-active')}
              </button>
            ) : isSimpleAdd ? (
              <button
                type='button'
                className='btn btn-active btn-sm'
                disabled={atMax}
                onClick={() =>
                  handleOptionSelect({
                    index,
                    minSelect,
                    maxSelect,
                    change: 1,
                  })
                }
              >
                <i className='bi bi-plus-lg'></i> {t('add-option')}
              </button>
            ) : (
              <div className='d-flex align-items-center gap-1 rounded border border-dark'>
                <button
                  type='button'
                  className='rounded border border-light btn btn-sm'
                  disabled={atMax}
                  onClick={() =>
                    handleOptionSelect({
                      index,
                      minSelect,
                      maxSelect,
                      change: 1,
                    })
                  }
                >
                  +
                </button>
                <span className='small fw-bold border-start border-end px-3'>
                  {formatNumber(count, lng)}
                </span>
                <button
                  type='button'
                  className='rounded border border-light btn btn-sm'
                  disabled={atMin}
                  onClick={() =>
                    handleOptionSelect({
                      index,
                      minSelect,
                      maxSelect,
                      change: -1,
                    })
                  }
                >
                  -
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
