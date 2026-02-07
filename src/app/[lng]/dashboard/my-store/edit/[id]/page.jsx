import { getT } from '@i18n/server';
import Link from 'next/link';
import Head from '../../(components)/Head';

function SectionCard({ section, customBtnColor = 'btn-active', id, t, lng }) {
  return (
    <div className='col-12 col-lg-6 col-xxl-4 d-flex'>
      <div className='card border-0 shadow bg-light px-3 pt-2 pb-4 w-100 h-100 d-flex flex-column'>
        <div className='card-header bg-light'>
          <div className='d-flex justify-content-between align-items-center'>
            <h2>{t(`edit.sections.${section}.title`)}</h2>
            <div>
              {section === 'general' && (
                <i className='bi bi-columns-gap text-info fs-4'></i>
              )}
              {section === 'items' && (
                <i className='bi bi-cup-hot text-dark fs-4'></i>
              )}
              {section === 'tables' && (
                <i className='bi bi-dice-6 text-dark fs-4'></i>
              )}
              {section === 'working-hour' && (
                <i className='bi bi-clock-history text-success fs-4'></i>
              )}
              {section === 'delete' && (
                <i className='bi bi-trash3 fs-4 text-danger'></i>
              )}
            </div>
          </div>
        </div>

        <div className='card-body flex-grow-1'>
          {t(`edit.sections.${section}.description`)}
        </div>

        <Link
          href={`/${lng}/dashboard/my-store/edit/${id}/${section}`}
          className={`btn ${customBtnColor} mt-3`}
        >
          {t('edit.open-section')}
        </Link>
      </div>
    </div>
  );
}

export default async function Page({ params }) {
  const { id, lng } = await params;
  const { t } = await getT(lng, 'dashboard-my-store');

  return (
    <div className='container'>
      <Head
        lng={lng}
        title='edit.title'
        subTitle='edit.subtitle'
        hasStore={true}
      />

      <div className='row d-flex align-items-stretch align-items-center justify-content-center g-3 mt-3'>
        <SectionCard
          key={`edit-general-${id}`}
          id={id}
          t={t}
          lng={lng}
          section='general'
        />
        <SectionCard
          key={`edit-items-${id}`}
          id={id}
          t={t}
          lng={lng}
          section='items'
        />
        <SectionCard
          key={`edit-tables-${id}`}
          id={id}
          t={t}
          lng={lng}
          section='tables'
        />
        <SectionCard
          key={`edit-working-hour-${id}`}
          id={id}
          t={t}
          lng={lng}
          section='working-hour'
        />
        <SectionCard
          key={`edit-delete-${id}`}
          section='delete'
          id={id}
          t={t}
          lng={lng}
          customBtnColor='btn-danger text-light'
        />
      </div>
    </div>
  );
}
