'use client';

import './Style.css';

export default function Loading() {
  return (
    <div
      className={`loading-screen fixed top-0 left-0 w-full h-full flex justify-center items-center`}
    >
      <div className={`loader`}></div>
    </div>
  );
}
