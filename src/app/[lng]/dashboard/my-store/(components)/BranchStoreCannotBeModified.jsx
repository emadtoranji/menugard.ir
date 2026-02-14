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
      <div className='container'>
        <Head
          lng={lng}
          title='edit.title'
          subTitle={null}
          id={id}
          hasStore={true}
          hasHomeEdit={true}
        />

        {message ? (
          <h4 className='container text-black bg-red-600 mt-5 p-2 rounded-lg'>
            {t(message)}
          </h4>
        ) : undefined}
      </div>
    </AnimatedPage>
  );
}
