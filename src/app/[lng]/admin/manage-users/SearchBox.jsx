'use client';

import { replaceInvalidSearchInput } from '@utils/replaceInvalidSearchInput';
import { useState } from 'react';

export function SearchForm({ t, fetchUsers }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSetQuery = (text = undefined) => {
    if (typeof text !== 'string') {
      setSearchQuery('');
    } else {
      setSearchQuery(replaceInvalidSearchInput(text));
    }
  };

  return (
    <div className='container'>
      <div className='flex gap-3 bg-white text-purple-600 border border-purple-800 p-2 m-0 rounded-2xl'>
        <input
          type='text'
          className='bg-white border-white text-purple-500 form-control rounded-full border-0 text-center'
          placeholder={t('general.search-placeholder')}
          value={searchQuery}
          onChange={(e) => handleSetQuery(e.target.value)}
        />

        <button
          type='button'
          className={`btn rounded-0 border-0 ${
            searchQuery.length ? '' : 'opacity-50'
          }`}
          onClick={handleSetQuery}
          disabled={!searchQuery.length}
        >
          <span className='visually-hidden'>Make Search Box Empty</span>
          <i className='bi bi-arrow-repeat h4'></i>
        </button>
        <button
          type='submit'
          onClick={() => fetchUsers(searchQuery)}
          className={`btn rounded-0 border-0 ${
            searchQuery.length ? '' : 'opacity-50'
          }`}
          disabled={!searchQuery.length}
        >
          <span className='visually-hidden'>Submit Search</span>
          <i className='bi bi-search h4'></i>
        </button>
      </div>
    </div>
  );
}
