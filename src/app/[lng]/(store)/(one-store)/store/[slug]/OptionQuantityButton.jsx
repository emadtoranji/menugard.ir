import Loading from '@components/Loading/client';
import { useOrder } from '@context/notes/order/useOrder';
import { useT } from '@i18n/client';
import { fallbackLng } from '@i18n/settings';
import { formatNumber } from '@utils/numbers';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function OptionQuantityButton({ item = null, option }) {
  const { t } = useT('store');
  const lng = useParams()?.lng || fallbackLng;
  const { state, updateOption } = useOrder();
  if (state === null) return <Loading />;

  const itemId = item.id;
  const isOrderable = item?.isAvailable && item?.isActive;
  const orderItem = (state?.items || []).find((i) => i.id === itemId);
  const optionCounts = {};
  orderItem?.options?.forEach((o) => {
    optionCounts[o.id] = o.count ?? o.minSelect ?? 0;
  });
  const optionId = option.id;
  const count = optionCounts?.[optionId] ?? option.minSelect ?? 0;
  const isOrderableOption = isOrderable ? (option?.isActive ?? true) : false;
  const minSelect = option.minSelect ?? 0;
  const maxSelect = option.maxSelect ?? 1;
  const atMin = count <= minSelect;
  const atMax = count >= maxSelect;
  const isSimpleAdd = (minSelect === 0 || minSelect === 1) && maxSelect === 1;
  const isRequiredAndIsSimple = option.isRequired && isSimpleAdd;

  function handleOptionSelect({ optionId, minSelect, maxSelect, change }) {
    const currentCount = optionCounts[optionId] ?? minSelect;
    const nextCount = Math.min(
      maxSelect,
      Math.max(minSelect, currentCount + change),
    );

    const optionToUpdate = orderItem.options.find((o) => o.id === optionId);
    if (!optionToUpdate) return;

    if (!optionToUpdate?.isActive) {
      toast.error(t('is-not-active'));
    } else {
      updateOption(itemId, { ...optionToUpdate, count: nextCount });
    }
  }

  return !isOrderableOption ? (
    <button type='button' className='btn btn-danger btn-sm' disabled>
      {t('is-not-active')}
    </button>
  ) : isRequiredAndIsSimple ? (
    <button
      type='button'
      className='d-flex gap-1 align-items-center btn btn-active p-2'
      disabled
    >
      <i className='d-flex align-items-center bi bi-check2-circle'></i>
      <span className='d-none'>{t('is-required')}</span>
    </button>
  ) : isSimpleAdd && count === 0 ? (
    <button
      type='button'
      className='d-flex gap-1 btn btn-active p-2'
      onClick={() =>
        handleOptionSelect({
          optionId,
          minSelect,
          maxSelect,
          change: 1,
        })
      }
    >
      <i className='d-flex align-items-center bi bi-plus-lg'></i>
      <span className='d-none'>{t('add-option')}</span>
    </button>
  ) : isSimpleAdd && count === 1 ? (
    <button
      type='button'
      className='d-flex gap-1 btn btn-danger p-2'
      onClick={() =>
        handleOptionSelect({
          optionId,
          minSelect,
          maxSelect,
          change: -1,
        })
      }
    >
      <i className='d-flex align-items-center bi bi-trash3'></i>
      <span className='d-none'>{t('remove-option')}</span>
    </button>
  ) : (
    <div className='d-flex align-items-center gap-1 rounded border border-dark'>
      <button
        type='button'
        className='rounded border border-light btn p-2'
        disabled={atMax}
        onClick={() =>
          handleOptionSelect({
            optionId,
            minSelect,
            maxSelect,
            change: 1,
          })
        }
      >
        +
      </button>

      <span className='small fw-bold border-start border-end px-2 px-lg-3'>
        {formatNumber(count, lng)}
      </span>

      <button
        type='button'
        className='rounded border border-light btn p-2'
        disabled={atMin}
        onClick={() =>
          handleOptionSelect({
            optionId,
            minSelect,
            maxSelect,
            change: -1,
          })
        }
      >
        -
      </button>
    </div>
  );
}
