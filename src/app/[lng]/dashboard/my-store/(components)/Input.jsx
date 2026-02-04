'use client';

import { exportOnlyNumberFromString, formatNumber } from '@/src/utils/numbers';

export default function Input({
  type = 'text',
  name,
  value,
  HandleChange,
  label = '',
  disabled = true,
  hasValidValue = false,
  isRtl = false,
  min = undefined,
  max = undefined,
}) {
  return (
    <div className='w-100'>
      <h6>{label || name}</h6>
      <div className='form-floating '>
        {type === 'numeric' ? (
          <>
            <input
              inputMode='numeric'
              style={{ textAlign: 'left', direction: 'ltr' }}
              type='text'
              className={`form-control ${hasValidValue ? '' : 'is-invalid'}`}
              placeholder={label}
              name={name}
              autoComplete='off'
              value={formatNumber(value)}
              onChange={(e) =>
                HandleChange(
                  name,
                  exportOnlyNumberFromString({
                    value: e.target.value,
                    float: false,
                  }),
                )
              }
              disabled={disabled}
              required
              min={min}
              max={max}
            />
          </>
        ) : type === 'textarea' ? (
          <textarea
            style={{
              height: '150px',
              direction: isRtl ? 'rtl' : 'ltr',
              textAlign: isRtl ? 'right' : 'left',
            }}
            className={`form-control ${hasValidValue ? '' : 'is-invalid'}`}
            placeholder={label}
            name={name}
            value={value}
            onChange={(e) => HandleChange(name, e.target.value)}
            autoComplete={undefined}
            disabled={disabled}
            required
            minLength={min}
            maxLength={max}
          />
        ) : (
          <input
            style={
              !value
                ? { textAlign: 'center' }
                : isRtl
                  ? { textAlign: 'right', direction: 'rtl' }
                  : { textAlign: 'left', direction: 'ltr' }
            }
            type={type}
            className={`form-control ${hasValidValue ? '' : 'is-invalid'}`}
            placeholder={label}
            name={name}
            value={value}
            onChange={(e) => HandleChange(name, e.target.value)}
            autoComplete={undefined}
            disabled={disabled}
            required
            minLength={min}
            maxLength={max}
          />
        )}

        <label className='end-0 px-5'>{label || name}</label>
      </div>
    </div>
  );
}
