'use client';

import { useT } from '@i18n/client';
import toast from 'react-hot-toast';

const activeButton = `text-success fw-bolder border-bottom border-3 border-success`;
const deactiveButton = `border-bottom border-3 border-muted`;

export default function SelectGateway({
  allGatewaysFiltered,
  gateway,
  setGateway,
}) {
  const { t } = useT('dashboard');

  function handleSetGateway(newGateway) {
    setGateway(newGateway);
    const message =
      newGateway === 'IRANIAN'
        ? t('dashboard.finance.rial-description')
        : newGateway === 'TRANSFER-IRANIAN-CARD'
          ? t('dashboard.finance.transfer-iranian-card-description')
          : newGateway === 'CRYPTOCURRENCY'
            ? t('dashboard.finance.crypto-description')
            : undefined;

    if (message) {
      toast(message, {
        duration: 10_000,
        icon: '💲',
        position: 'bottom-left',
        style: {
          textAlign: 'justify',
          color: 'var(--color-text-main)',
        },
      });
    }
  }

  return (
    <>
      <div className='w-full grid grid-cols-3 grid-cols-sm-1 grid-cols-sm-3 btn-group gap-1 mx-1 text-center fw-normal text-md mt-2'>
        {allGatewaysFiltered.map((g) => {
          return (
            <div
              key={g.id}
              className={`w-full cursor-pointer pb-1 ${
                gateway === g.id ? activeButton : deactiveButton
              }`}
              onClick={() => handleSetGateway(g.id)}
            >
              {t(g.title)}
            </div>
          );
        })}
      </div>
    </>
  );
}
