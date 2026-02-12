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
    <div className='w-full'>
      <h6>{label || name}</h6>
      {type === 'numeric' ? (
        <>
          <input
            inputMode='numeric'
            style={{ textAlign: 'left', direction: 'ltr' }}
            type='text'
            className={`form-control bg-white text-active ${hasValidValue ? 'is-valid' : 'is-invalid'}`}
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
          className={`form-control bg-white text-active ${hasValidValue ? 'is-valid' : 'is-invalid'}`}
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
          className={`form-control bg-white text-active ${hasValidValue ? 'is-valid' : 'is-invalid'}`}
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
    </div>
  );
}
