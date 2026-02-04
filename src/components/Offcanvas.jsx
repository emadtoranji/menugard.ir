export function OffcanvasButton({
  id = null,
  btnTitle = 'Offcanvas',
  btnClass = 'btn-primary',
}) {
  return (
    <button
      className={`btn ${btnClass}`}
      type='button'
      data-bs-toggle='offcanvas'
      data-bs-target={`#${id}`}
      aria-controls={id}
    >
      {btnTitle}
    </button>
  );
}

export function OffcanvasWrapper({
  title,
  id = null,
  children,
  zIndex = 1000,
}) {
  return (
    <div
      style={{ zIndex }}
      className='offcanvas offcanvas-bottom h-100'
      tabIndex='-1'
      id={id}
      aria-labelledby={`${id}Label`}
    >
      <div className='offcanvas-header d-flex align-items-center justify-content-between'>
        <h5 className='offcanvas-title' id={`${id}Label`}>
          {title}
        </h5>
        <div>
          <button
            type='button'
            className='btn-close'
            data-bs-dismiss='offcanvas'
            aria-label='Close'
          ></button>
        </div>
      </div>
      <div className='offcanvas-body'>{children}</div>
    </div>
  );
}
