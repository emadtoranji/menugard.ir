import { fallbackLng } from '@i18n/settings';
import { humanDateCreator } from '@utils/humanDateCreator';
import { formatNumber } from '@utils/numbers';

export default function Index({
  data = [],
  t = undefined,
  currentLang = fallbackLng,
}) {
  if (!t) {
    return null;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className='text-gray-600 text-center py-16 text-lg'>
        {t('table.noData')}
      </div>
    );
  }

  const headerKeys = Object.keys(data[0]);

  return (
    <div className='table-responsive shadow-lg rounded-3'>
      <table className='table table-light table-sm table-striped table-hover text-center align-middle w-full'>
        <thead className='table-dark'>
          <tr>
            {headerKeys.map((key) => {
              const lowerKey = key.toLowerCase();
              if (lowerKey === 'currency') return null;
              return (
                <th
                  scope='w-full'
                  key={lowerKey}
                  className={
                    lowerKey === 'id'
                      ? 'font-bold hidden d-sm-table-cell'
                      : lowerKey === 'description' ||
                          lowerKey === 'note' ||
                          lowerKey === 'message'
                        ? ' col-6 xl:w-5/12 col-xl-4'
                        : ''
                  }
                >
                  {t(`table.thead.${lowerKey}`)}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className='table-group-divider'>
          {data.map((item) => (
            <tr key={item.id}>
              {headerKeys.map((key) => {
                const val = item[key];
                const lowerKey = key.toLowerCase();
                if (lowerKey === 'currency') return null;

                if (lowerKey === 'id') {
                  return (
                    <th
                      scope='row'
                      key={key}
                      className='hidden d-sm-table-cell font-bold'
                    >
                      {val}
                    </th>
                  );
                }

                if (typeof val === 'string') {
                  switch (lowerKey) {
                    case 'description':
                    case 'note':
                    case 'message':
                      return (
                        <td key={key} className='fw-light text-wrap small'>
                          {val || '-'}
                        </td>
                      );
                    default:
                      return <td key={key}>{val || <span>-</span>}</td>;
                  }
                }

                if (!val) {
                  return (
                    <td key={key}>
                      <span>-</span>
                    </td>
                  );
                }

                switch (val.action) {
                  case 't':
                    return (
                      <td key={key}>
                        <span>{t(val.value?.toString() || '-', '-')}</span>
                      </td>
                    );
                  case 'formatNumber': {
                    const currencyObj = item.currency;
                    const currencyText =
                      currencyObj && currencyObj.action === 't'
                        ? t(currencyObj.value?.toString() || '-', '-')
                        : '';

                    return (
                      <td key={key} className=''>
                        <span>{formatNumber(val.value, currentLang)}</span>
                        {currencyText ? (
                          <span className='small currency-font mx-1'>
                            {currencyText}
                          </span>
                        ) : undefined}
                      </td>
                    );
                  }
                  case 'date':
                    return (
                      <td key={key}>
                        <span className='badge text-bg-success'>
                          {humanDateCreator(
                            val.value?.toString(),
                            currentLang,
                            false,
                            false,
                          )}
                        </span>
                      </td>
                    );
                  default:
                    return <td key={key}>{val}</td>;
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
