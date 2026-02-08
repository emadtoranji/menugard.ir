import { fallbackLng } from '@/src/app/i18n/settings';
import { getT } from '@i18n/server';
import Head from './Head';
import AnimatedPage from '@components/AnimatedPage';

export default async function BranchStoreCannotBeModified({
  params,
  id,
  message = '',
}) {
  const { lng = fallbackLng } = (await params) || {};
  const { t } = await getT(lng, 'dashboard-my-store');

  return (
    <AnimatedPage>
      <div className='container-fluid px-0 px-lg-2 px-xxl-3'>
        <div className='container-lg'>
          <Head
            lng={lng}
            title='edit.title'
            subTitle={null}
            id={id}
            hasStore={true}
            hasHomeEdit={true}
          />
        </div>

        {message ? (
          <h4 className='container text-bg-danger mt-5 p-2 rounded'>
            {t(message)}
          </h4>
        ) : undefined}
      </div>
    </AnimatedPage>
  );
}
