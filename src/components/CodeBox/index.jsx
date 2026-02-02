'use client';

import { useCopyToClipboard } from '@utils/useCopyToClipboard';
import { useT } from '@i18n/client';
import { isValidJSON } from '@utils/isValidJSON';
export default function CodeBox({
  code = undefined,
  title = '',
  roundedTop = true,
}) {
  const makeCopyToClipboard = useCopyToClipboard();
  const { t } = useT('services');

  if (!code) return undefined;
  code =
    isValidJSON(code) || typeof code === 'object'
      ? JSON.stringify(code, null, 2)
      : code;

  return (
    <div className='position-relative'>
      {title ? (
        <span className='d-block text-black text-opacity-75 fw-bold mb-2 px-2'>
          {title}
        </span>
      ) : null}

      <div className='position-relative'>
        <pre
          className={`p-3 bg-black rounded ${
            roundedTop ? '' : 'rounded-top-0'
          } text-light shadow-lg mb-0 overflow-auto hide-scrollbar`}
          style={{
            direction: 'ltr',
            textAlign: 'left',
            minHeight: '250px',
            maxHeight: '250px',
          }}
        >
          <code>{code}</code>
        </pre>

        <div className='position-absolute bottom-0 end-0 mb-3 me-3'>
          <button
            className='btn btn-primary btn-sm fs-8 fw-bold copy'
            onClick={() => makeCopyToClipboard(code)}
          >
            {t('general.copy')}
          </button>
        </div>
      </div>
    </div>
  );
}
