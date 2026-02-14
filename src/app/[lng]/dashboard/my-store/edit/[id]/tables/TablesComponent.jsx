'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useT } from '@i18n/client';
import Spinner from '@components/Spinner';
import QRCode from 'qrcode';
import Image from 'next/image';

export default function StoreTables({ store, BaseUrlAddress }) {
  const { t } = useT('dashboard-my-store');
  const [tables, setTables] = useState(store?.tables ? store.tables : {});
  const [adding, setAdding] = useState(false);

  function addNewTableCard() {
    setAdding(true);
    setTables((prev) => [
      ...prev,
      { id: null, title: '', isActive: true, qrCode: null },
    ]);
  }

  function removeTableFromState(tableId, index) {
    setTables((prev) => prev.filter((t, i) => t.id !== tableId && i !== index));
  }

  return (
    <div className=''>
      <div className='w-full'>
        <button
          className='btn btn-lg btn-active w-full mb-5'
          onClick={addNewTableCard}
        >
          {t('edit.sections.tables.new-table-button')}
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2'>
        {tables.map((table, index) => (
          <div className='card h-full' key={table.id ?? `new-${index}`}>
            <StoreTableCard
              table={table}
              store={store}
              BaseUrlAddress={BaseUrlAddress}
              allTables={tables}
              onSave={(updatedTable) => {
                setTables((prev) => {
                  const next = [...prev];
                  next[index] = updatedTable;
                  return next;
                });
              }}
              onDelete={() => removeTableFromState(table.id, index)}
            />
          </div>
        ))}
      </div>

      {tables?.length >= 12 && (
        <div className='w-full'>
          <button
            className='btn btn-lg btn-active w-full mt-3'
            onClick={addNewTableCard}
          >
            {t('edit.sections.tables.new-table-button')}
          </button>
        </div>
      )}
    </div>
  );
}

function StoreTableCard({
  table,
  store,
  BaseUrlAddress,
  onSave,
  onDelete,
  allTables,
}) {
  const { t } = useT('dashboard-my-store');
  const [title, setTitle] = useState(table.title || '');
  const [isActive, setIsActive] = useState(table.isActive ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCode, setQrCode] = useState(table?.qrCode || null);

  const isEdit = !!table.id;
  const tableLink = table.id
    ? `${BaseUrlAddress}store/${store.id}?table=${table.id}&source=qrcode`
    : null;

  async function submit() {
    const duplicate = allTables.some(
      (t) =>
        t !== table &&
        t.title.trim().toLowerCase() === title.trim().toLowerCase(),
    );
    if (duplicate) {
      toast.error(t('edit.sections.tables.table-name-duplicate'));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/dashboard/store/store-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeTableId: table.id,
          storeId: store.id,
          title,
          isActive,
        }),
      });
      const result = await res.json();

      if (result.ok) {
        toast.success(t('edit.updated-successfully'));
        const updatedTable = { ...table, title, isActive };
        if (!isEdit && result?.result?.tableId)
          updatedTable.id = result.result.tableId;
        onSave(updatedTable);
      } else {
        toast.error(
          t(`code-responses.${result.message}`) || t('general.unknown-problem'),
        );
      }
    } catch {
      toast.error(t('general.unknown-problem'));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function generateQrCode() {
    if (qrCode) return;
    if (!tableLink) return toast.error(t('general.unknown-problem'));
    try {
      const dataUrl = await QRCode.toDataURL(tableLink, {
        width: 200,
        margin: 2,
      });
      setQrCode(dataUrl);
    } catch {
      toast.error(t('general.unknown-problem'));
    }
  }

  function downloadQrCode() {
    if (!qrCode) return;
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `store-${table.id || 'new'}-qrcode.png`;
    link.click();
  }

  async function deleteTable() {
    if (!isEdit) {
      if (window.confirm(t('edit.sections.tables.confirm-delete'))) {
        onDelete();
      }
      return;
    }
    if (!window.confirm(t('edit.sections.tables.confirm-delete'))) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/dashboard/store/store-table', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeTableId: table.id }),
      });
      const result = await res.json();
      if (result.ok) {
        toast.success(t('edit.sections.tables.deleted-successfully'));
        onDelete();
      } else {
        toast.error(result.message || t('general.unknown-problem'));
      }
    } catch {
      toast.error(t('general.unknown-problem'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='card-body gap-3'>
      <input
        type='text'
        className='form-control mb-3'
        placeholder={t('edit.sections.tables.table-name-title')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className='flex gap-2 mb-3'>
        <button
          type='button'
          className={`btn btn-sm w-full ${isActive ? 'btn-success' : 'text-green-600 border border-green-600 rounded'}`}
          onClick={() => setIsActive(true)}
        >
          {t('edit.sections.tables.is-active')}
        </button>
        <button
          type='button'
          className={`btn btn-sm w-full ${!isActive ? 'btn-danger' : 'text-red-600 border border-red-600 rounded'}`}
          onClick={() => setIsActive(false)}
        >
          {t('edit.sections.tables.is-deactive')}
        </button>
      </div>

      {isEdit && (
        <div className='flex gap-2 mb-3'>
          <button
            className='btn btn-sm btn-active w-full'
            onClick={generateQrCode}
            disabled={!table.id || qrCode}
          >
            {t('edit.sections.tables.generateQrCode')}
          </button>
          {qrCode && (
            <button
              className='btn btn-sm btn-success w-full'
              onClick={downloadQrCode}
            >
              {t('edit.sections.tables.downloadQrCode')}
            </button>
          )}
        </div>
      )}

      {qrCode && (
        <div className='text-center mb-3'>
          <Image
            width={200}
            height={200}
            src={qrCode}
            alt='QR Code'
            className='mx-auto block'
          />
        </div>
      )}

      <div className='flex gap-2 pt-2 mt-7 border-t border-t-stone-300'>
        {isSubmitting ? (
          <button className='btn btn-warning w-full' disabled>
            <Spinner />
          </button>
        ) : (
          <>
            <button
              className='btn btn-success w-full'
              onClick={submit}
              disabled={!title || isSubmitting}
            >
              {t('edit.sections.tables.save-table')}
            </button>

            {isEdit && (
              <button
                className='btn btn-danger w-full'
                onClick={deleteTable}
                disabled={isSubmitting}
              >
                {t('edit.sections.tables.delete-table')}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
