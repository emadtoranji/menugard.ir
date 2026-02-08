'use client';
import { useState } from 'react';
import { replaceInvalidSearchInput } from '@utils/replaceInvalidSearchInput';
import { useRouter } from 'next/navigation';
import { useT } from '@i18n/client';

export default function SearchForm({
  search: initialSearch = '',
  slugFiltered = '',
  title = '',
  lng,
}) {
  const { t } = useT('store');

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');

  const handleSearch = (empty = false) => {
    const query = empty ? '' : searchQuery.trim();
    let alive = true;
    const params = new URLSearchParams();
    if (slugFiltered) params.set('slug', slugFiltered);
    if (query) params.set('search', query);
    params.delete('page');
    if (alive) router.push(`/${lng}/store?${params.toString()}`);
    return () => {
      alive = false;
    };
  };

  const handleReset = () => {
    setSearchQuery('');
    handleSearch(true);
  };

  const handleInputChange = (e, forceText = null) => {
    const value = forceText === null ? e.target.value : forceText;
    setSearchQuery(replaceInvalidSearchInput(value));
  };

  return (
    <div className='text-center position-relative overflow-hidden position-relative search-section text-light position-relative overflow-hidden'>
      <div className='d-flex justify-content-center align-items-center p-4'>
        <form
          className='d-flex justify-content-center w-100'
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div className='search-container d-flex border border-2 border-white p-0 m-0 rounded-pill w-100 px-2'>
            <input
              type='text'
              className='fs-5 search-input bg-transparent form-control rounded-0 border-0 border-light text-active'
              placeholder={t('search-placeholder')}
              value={searchQuery}
              onChange={handleInputChange}
            />
            <button
              type='button'
              className={`search-button btn border-0 text-white ${
                searchQuery.length === 0 ? 'opacity-50' : ''
              }`}
              onClick={handleReset}
              disabled={searchQuery.length === 0}
            >
              <span className='visually-hidden'>Reset Search Input</span>
              <i className='fs-5 bi bi-arrow-repeat text-active'></i>
            </button>
            <button
              type='submit'
              className={`search-button btn border-0 text-white ${
                searchQuery.length === 0 ? 'opacity-50' : ''
              }`}
              disabled={searchQuery.length === 0}
            >
              <span className='visually-hidden'>Submit Search</span>
              <i className='fs-5 bi bi-search text-active'></i>
            </button>
          </div>
        </form>
      </div>

      <div className='p-2 d-flex gap-2 d-none'>
        <h1 className='fw-bold w-100 text-active'>
          <span>{title || t('title')}</span>
        </h1>
      </div>
    </div>
  );
}
