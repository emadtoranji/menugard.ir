import Image from 'next/image';
import Link from 'next/link';
import {
  nav_admin,
  nav_dashboard,
  nav_default,
  signin_default,
} from './handler';
import ActivePage from './ActivePage';
import MobileNavbar from './MobileNavbar';

export default async function Navigation({
  t,
  currentLang,
  section = 'default',
  userId = undefined,
  accessibility = 'user',
}) {
  let customNav;
  const isLogin = typeof userId === 'string' && userId;

  if (section === 'admin') {
    if (userId) {
      customNav = nav_admin({ t, currentLang });
    } else if (['admin', 'developer'].includes(accessibility)) {
      customNav = signin_default({ t, currentLang });
    }
  } else if (section === 'dashboard') {
    customNav = nav_dashboard({
      t,
      currentLang,
      isAdmin: ['admin', 'developer'].includes(accessibility),
      isLogin,
    });
  }

  if (!customNav) {
    customNav = userId
      ? nav_dashboard({
          t,
          currentLang,
          isAdmin: ['admin', 'developer'].includes(accessibility),
          isLogin,
        })
      : nav_default({ t, currentLang, isLogin });
  }

  if (!Array.isArray(customNav)) return null;

  return (
    <nav className='w-full shadow-2xl fixed top-0'>
      <div className='md:px-2 mx-auto max-w-7xl'>
        <MobileNavbar
          brand={
            <Link
              href={`/${currentLang}`}
              className='flex items-center gap-3 font-semibold text-lg'
            >
              <Image
                src='/images/icons/512/app-logo.webp'
                alt='APP Logo'
                width={50}
                height={50}
                priority
              />
              {t('general.app-name')}
            </Link>
          }
          items={customNav.map((nav, index) => (
            <ActivePage key={index} nav={nav} />
          ))}
        />
      </div>
    </nav>
  );
}
