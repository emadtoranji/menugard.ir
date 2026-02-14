'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ActivePage({ nav }) {
  const pathname = usePathname();
  const currentPath = pathname?.trim() || '';

  if (!nav?.title || !nav?.path) {
    return null;
  }

  const isActive = currentPath === nav.path;
  const isSignIn = nav?.id === 'signin';
  const isSignOut = nav?.id === 'signout';

  return (
    <li className=''>
      <Link
        className={`${isActive ? 'font-bold' : 'font-light'} text-nowrap ${
          isSignIn
            ? 'text-white'
            : isSignOut
              ? 'text-red-700 font-bold'
              : 'text-white'
        }`}
        href={nav.path}
      >
        {nav.title}
      </Link>
    </li>
  );
}
