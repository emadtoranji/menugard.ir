'use client';

import './Style.css';

export default function Loading() {
  return (
    <div
      className={`loading-screen position-fixed top-0 left-0 w-100 h-100 d-flex justify-content-center align-items-center`}
    >
      <div className={`loader`}></div>
    </div>
  );
}
