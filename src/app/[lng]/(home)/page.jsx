import Intro from './Intro';
import SuitableUsage from './SuitableUsage';
import QrCodeUsage from './QrCodeUsage';
import DashboardSimple from './DashboardSimple';
import MigrationToDigitalMenu from './MigrationToDigitalMenu';

export default async function LngPage({ params }) {
  const { lng } = await params;

  return (
    <>
      <Intro lng={lng} />
      <SuitableUsage lng={lng} />
      <QrCodeUsage lng={lng} />
      <DashboardSimple lng={lng} />
      <MigrationToDigitalMenu lng={lng} />
    </>
  );
}
