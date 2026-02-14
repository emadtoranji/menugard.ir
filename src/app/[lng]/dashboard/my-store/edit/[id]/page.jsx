import { getT } from '@i18n/server';
import Link from 'next/link';
import Head from '../../(components)/Head';

function SectionCard({ section, customBtnColor = 'btn-active', id, t, lng }) {
  return (
    <div className='card bg-white px-3 pt-2 pb-8 w-full h-full flex flex-col'>
      <div className='card-title bg-white'>
        <div className='flex justify-between items-center'>
          <h2>{t(`edit.sections.${section}.title`)}</h2>
          <div>
            {section === 'general' && (
              <i className='icon bi bi-building-fill-gear text-stone-600'></i>
            )}
            {section === 'items' && (
              <i className='icon bi bi-cup-hot-fill text-orange-900'></i>
            )}
            {section === 'tables' && (
              <i className='icon bi bi-dice-6-fill text-blue-500'></i>
            )}
            {section === 'working-hour' && (
              <i className='icon bi bi-clock-fill text-green-500'></i>
            )}
            {section === 'delete' && (
              <i className='icon bi bi-trash3-fill text-red-700'></i>
            )}
          </div>
        </div>
      </div>

      <div className='card-body grow'>
        {t(`edit.sections.${section}.description`)}
      </div>

      <Link
        href={`/${lng}/dashboard/my-store/edit/${id}/${section}`}
        className={`btn btn-lg ${customBtnColor} mt-3 text-center`}
      >
        {t('edit.open-section')}
      </Link>
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

      <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 align-items-stretch items-center justify-center gap-3 my-6'>
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
          customBtnColor='btn-danger'
        />
      </div>
    </div>
  );
}
