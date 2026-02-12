'use client';

import { useState } from 'react';

export default function MobileNavbar({ brand, items }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='w-full relative flex items-center justify-between'>
      <div className='container flex items-center justify-between w-full py-2 px-4'>
        {brand}

        <button
          type='button'
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label='Toggle navigation'
          className='md:hidden p-2 text-2xl transition'
        >
          <i className={`bi ${isOpen ? 'bi-x' : 'bi-list'}`}></i>
        </button>
      </div>

      <div
        className={`
          absolute top-full left-0 w-full md:static md:flex md:w-auto
          overflow-hidden transition-all duration-300 ease
          bg-[var(--color-bg-nav)] text-[var(--color-text-nav)]
          md:overflow-visible md:bg-transparent align-center ${isOpen ? 'h-auto' : 'h-0'} md:h-auto
        `}
      >
        <ul className='container grid md:flex gap-4 py-4 px-4 md:py-0 md:px-0'>
          {items}
        </ul>
      </div>
    </div>
  );
}
