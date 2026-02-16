'use client';

import { useState } from 'react';
import { replaceInvalidSearchInput } from '@utils/replaceInvalidSearchInput';
import { useParams, useRouter } from 'next/navigation';
import { useT } from '@i18n/client';
import { fallbackLng } from '@i18n/settings';

export default function SearchForm({
  search: initialSearch = '',
  slugFiltered = '',
  title = '',
}) {
  const lng = useParams()?.lng || fallbackLng;
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
    <div className='container pb-8'>
      <form
        className='flex justify-center w-full max-w-3xl mx-auto text-center relative text-active position-relative overflow-hidden'
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <div className='flex gap-3 bg-white p-0 m-0 rounded-full w-full px-4 border border-purple'>
          <input
            type='text'
            className='text-lg border-none bg-transparent form-control'
            placeholder={t('search-placeholder')}
            value={searchQuery}
            onChange={handleInputChange}
          />
          <button
            type='button'
            className={`btn border-0 ${
              searchQuery.length === 0 ? 'opacity-50' : ''
            }`}
            onClick={handleReset}
            disabled={searchQuery.length === 0}
          >
            <span className='sr-only'>Reset Search Input</span>
            <i className='icon bi bi-arrow-repeat text-active'></i>
          </button>
          <button
            type='submit'
            className={`btn border-0 ${
              searchQuery.length === 0 ? 'opacity-50' : ''
            }`}
            disabled={searchQuery.length === 0}
          >
            <span className='sr-only'>Submit Search</span>
            <i className='icon bi bi-search text-active'></i>
          </button>
        </div>
      </form>
    </div>
  );
}
