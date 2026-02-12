import { getT } from '@i18n/server';
import { formatNumber } from '@utils/numbers';
import Link from 'next/link';

function ChangeByButton({
  baseHref,
  queryString,
  t,
  current_page,
  total_pages,
  isNext = null,
}) {
  if (isNext === null) return undefined;

  let isDisabled = current_page === total_pages;
  if (!isDisabled) {
    if (!isNext && current_page === 1) {
      isDisabled = true;
    } else if (isNext && current_page >= total_pages) {
      isDisabled = true;
    }
  }

  const LiclassName = `text-active border-0 fw-bolder mx-md-1 mx-xl-2`;
  const LiTitle = <span>{isNext ? t('next') : t('prev')}</span>;

  return (
    <li>
      {isDisabled ? (
        <button
          type='button'
          className={`btn ${LiclassName} disabled opacity-50`}
          disabled={true}
        >
          {LiTitle}
          <span className='visually-hidden'>
            {isNext ? 'Next Button' : 'Prev Button'}
          </span>
        </button>
      ) : (
        <Link
          className={LiclassName}
          href={`${baseHref}${queryString}page=${isNext ? current_page + 1 : current_page - 1}`}
        >
          {LiTitle}
        </Link>
      )}
    </li>
  );
}

function NumberButtons({
  baseHref,
  queryString,
  page = undefined,
  isActive = false,
  lng,
}) {
  if (page === undefined) return undefined;
  return (
    <li className=''>
      <Link
        className={`py-2 px-3 rounded ${isActive ? 'shadow font-bold' : ''}`}
        href={`${baseHref}${queryString}page=${page}`}
      >
        <span>{formatNumber(page, lng)}</span>
      </Link>
    </li>
  );
}

function DisabledButton() {
  return (
    <li className='disabled'>
      <span className=''>…</span>
    </li>
  );
}

export async function Pagination({
  current_page,
  total_pages,
  lng,
  slug,
  search,
}) {
  const { t } = await getT(lng, 'store');
  const range = 2;

  const pages = [];
  for (
    let i = Math.max(1, current_page - range);
    i <= Math.min(total_pages, current_page + range);
    i++
  ) {
    pages.push(i);
  }

  const baseHref = `/${lng}/store`;
  const queryParams = new URLSearchParams();
  if (slug) queryParams.set('slug', slug);
  if (search) queryParams.set('search', search);
  const queryString = queryParams.toString()
    ? `?${queryParams.toString()}&`
    : '?';

  return (
    <div className='container-fluid container-md mx-0 mx-md-auto px-1 px-md-1 px-lg-2 px-xl-3 px-xxl-4 mt-5'>
      <nav aria-label='Pagination'>
        <ul className='pagination pagination-sm flex justify-between items-center gap-1 fs-7 bg-light rounded shadow text-active px-0 py-2'>
          <ChangeByButton
            total_pages={total_pages}
            current_page={current_page}
            baseHref={baseHref}
            queryString={queryString}
            t={t}
            isNext={false}
          />

          <div className='flex justify-center items-center gap-1 gap-md-2'>
            {current_page > range + 1 && (
              <>
                <NumberButtons
                  baseHref={baseHref}
                  queryString={queryString}
                  page={1}
                  lng={lng}
                />
                <DisabledButton />
              </>
            )}

            {pages.map((p) => (
              <NumberButtons
                baseHref={baseHref}
                queryString={queryString}
                key={p}
                page={p}
                isActive={p === current_page}
                lng={lng}
              />
            ))}

            {current_page < total_pages - range && (
              <>
                <DisabledButton />
                <NumberButtons
                  baseHref={baseHref}
                  queryString={queryString}
                  page={total_pages}
                  lng={lng}
                />
              </>
            )}
          </div>

          <ChangeByButton
            total_pages={total_pages}
            current_page={current_page}
            baseHref={baseHref}
            queryString={queryString}
            t={t}
            isNext={true}
          />
        </ul>
      </nav>
    </div>
  );
}
