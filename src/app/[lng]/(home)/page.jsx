import Intro from './Intro';
import SuitableUsage from './SuitableUsage';
import QrCodeUsage from './QrCodeUsage';
import DashboardSimple from './DashboardSimple';
import MigrationToDigitalMenu from './MigrationToDigitalMenu';
import SearchEngines from './SearchEngines';

export default async function LngPage({ params }) {
  const { lng } = await params;

  return (
    <>
      <Intro lng={lng} />
      <SuitableUsage lng={lng} />
      <QrCodeUsage lng={lng} />
      <SearchEngines lng={lng} />
      <DashboardSimple lng={lng} />
      <MigrationToDigitalMenu lng={lng} />
    </>
  );
}
