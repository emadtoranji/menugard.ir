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
    <button
      type='button'
      className='flex gap-1 btn btn-sm btn-danger p-1 transition-all duration-500'
      disabled
    >
      <span className='sr-only'>Is Not Active</span>
      <i className='p-1 icon-sm bi bi-ban text-danger'></i>
      <span>{t('is-not-active')}</span>
    </button>
  ) : isRequiredAndIsSimple ? (
    <button
      type='button'
      className='flex gap-1 btn btn-sm btn-active p-1 transition-all duration-500'
      disabled
    >
      <span className='sr-only'>Is Requried</span>
      <i className='p-1 icon-sm bi bi-check2-circle'></i>
    </button>
  ) : isSimpleAdd && count === 0 ? (
    <button
      type='button'
      className='flex gap-1 btn btn-sm btn-active p-1 transition-all duration-500'
      onClick={() =>
        handleOptionSelect({
          optionId,
          minSelect,
          maxSelect,
          change: 1,
        })
      }
    >
      <span className='sr-only'>Add Option</span>
      <i className='p-1 icon-sm bi bi-plus-lg'></i>
    </button>
  ) : isSimpleAdd && count === 1 ? (
    <button
      type='button'
      className='flex gap-1 btn btn-sm btn-danger p-1 transition-all duration-500'
      onClick={() =>
        handleOptionSelect({
          optionId,
          minSelect,
          maxSelect,
          change: -1,
        })
      }
    >
      <span className='sr-only'>Remove Option</span>
      <i className='p-1 icon-sm bi bi-trash3'></i>
    </button>
  ) : (
    <div className='flex items-center rounded border border-muted'>
      <button
        type='button'
        className='rounded border-0 btn p-2 transition-all duration-500 text-lg'
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
        <span className='sr-only'>Add Option</span>
        <span>+</span>
      </button>

      <span className='small font-bold border-x border-muted px-2 lg:px-3'>
        {formatNumber(count, lng)}
      </span>

      <button
        type='button'
        className='rounded border-0 btn p-2 transition-all duration-500 text-lg'
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
        <span className='sr-only'>Remove Option</span>
        <span>-</span>
      </button>
    </div>
  );
}
