export default function Spinner({
  small = false,
  type = 'border',
  center = true,
  color = 'text-active',
}) {
  if (!['border', 'grow'].includes(type)) type = 'border';

  const sizeClass = small ? 'w-4 h-4' : 'w-8 h-8';
  const displayClass = center
    ? 'flex justify-center items-center'
    : 'inline-flex';

  if (type === 'border') {
    return (
      <div className={`${displayClass}`} role='status'>
        <div
          className={`${sizeClass} border-4 border-t-transparent border-solid rounded-full animate-spin ${color}`}
        />
        <span className='sr-only'>Loading...</span>
      </div>
    );
  } else if (type === 'grow') {
    return (
      <div className={`${displayClass}`} role='status'>
        <div
          className={`${sizeClass} rounded-full bg-current opacity-75 animate-pulse ${color}`}
        />
        <span className='sr-only'>Loading...</span>
      </div>
    );
  }
}
