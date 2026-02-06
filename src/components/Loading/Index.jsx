import './Style.css';

export default function Loading() {
  return (
    <div
      className={`loader-section position-fixed top-0 start-0 d-flex justify-content-center align-items-center`}
    >
      <div className={`loader`}></div>
    </div>
  );
}
