import { fallbackLng } from '@i18n/settings';
import Link from 'next/link';
import Main from './Main';

export default function Problem({
  content,
  code = 404,
  currentLang = fallbackLng,
  message = '',
}) {
  return (
    <Main>
      <div className='container flex items-center justify-center main-h-full text-center'>
        <div className=''>
          <div className='mb-3'>
            <div>
              <h1 className='font-bold text-active'>{code}</h1>
            </div>
          </div>
          <div className='mb-8'>
            <h3 className=''>
              <p>{content.title}</p>
            </h3>
          </div>
          <div className='mb-5'>
            <Link
              className='btn rounded btn btn-lg btn-primary font-bold'
              href={`/${currentLang}`}
            >
              {content.button}
            </Link>
          </div>
          <div className=''>
            {message && code == 500 ? <code>{message}</code> : undefined}
          </div>
        </div>
      </div>
    </Main>
  );
}
