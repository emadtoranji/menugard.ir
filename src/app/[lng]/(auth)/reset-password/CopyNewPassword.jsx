'use client';

import { useCopyToClipboard } from '@utils/useCopyToClipboard';

export default function CopyNewPassword({ newPassword }) {
  const makeCopyToClipboard = useCopyToClipboard();
  if (!newPassword) return null;

  return (
    <div className='text-center w-full '>
      <button
        className='btn btn-dark p-4 flex items-center justify-center mx-auto gap-2'
        onClick={() => makeCopyToClipboard(newPassword)}
      >
        <span className=''>{newPassword}</span>
        <i className='icon bi bi-copy text-xl'></i>
      </button>
    </div>
  );
}
