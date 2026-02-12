import './Style.css';

export default function Loading() {
  return (
    <div
      className={`loader-section fixed top-0 start-0 flex justify-center items-center`}
    >
      <div className={`loader`}></div>
    </div>
  );
}
