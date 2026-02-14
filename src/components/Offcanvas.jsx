'use client';

export function OffcanvasButton({
  showCanvas = false,
  setShowCanvas = undefined,
  btnTitle = 'Offcanvas',
  btnClass = 'btn-primary',
}) {
  return (
    <button
      className={`btn ${btnClass}`}
      type='button'
      onClick={() => setShowCanvas(!showCanvas)}
    >
      {btnTitle}
    </button>
  );
}

export function OffcanvasWrapper({
  title,
  children,
  showCanvas = false,
  setShowCanvas = undefined,
  zIndex = 5000,
}) {
  if (!showCanvas) return null;

  return (
    <div style={{ zIndex }} className={`bg-white pb-16 my-0 min-h-screen`}>
      <div className='container flex items-center justify-between border-b-2 border-muted py-3 shrink-0'>
        <h1>{title}</h1>
        <button
          type='button'
          className='btn'
          onClick={() => setShowCanvas(false)}
        >
          <i className='icon bi bi-x-lg text-black text-2xl'></i>
        </button>
      </div>

      <div className=''>
        <div className='container py-4'>{children}</div>
      </div>
    </div>
  );
}
