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
    <div className='relative'>
      {title ? (
        <span className='block text-black opacity-75 font-bold mb-4 px-4'>
          {title}
        </span>
      ) : null}

      <div className='relative'>
        <pre
          className={`p-5 bg-black rounded ${
            roundedTop ? '' : 'rounded-tl-none rounded-tr-none'
          } text-white shadow-lg mb-0 overflow-auto hide-scrollbar`}
          style={{
            direction: 'ltr',
            textAlign: 'left',
            minHeight: '250px',
            maxHeight: '250px',
          }}
        >
          <code>{code}</code>
        </pre>

        <div className='absolute bottom-0 end-0 mb-3 mr-3'>
          <button
            className='btn btn-primary btn-sm h8 font-bold copy'
            onClick={() => makeCopyToClipboard(code)}
          >
            {t('general.copy')}
          </button>
        </div>
      </div>
    </div>
  );
}
