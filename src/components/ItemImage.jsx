'use client';

import NextImage from 'next/image';
import { useEffect, useState } from 'react';
import Spinner from './Spinner';

export default function ItemImage({
  category,
  title,
  defaultImage = '/images/app-logo.webp',
  width = 100,
  height = 100,
  objectFit = 'contain',
}) {
  const basePath = category ? `/images/items/${category}` : null;

  const [finalSrc, setFinalSrc] = useState(null);

  useEffect(() => {
    const sources = basePath
      ? [`${basePath}.svg`, `${basePath}.webp`, `${basePath}.png`, defaultImage]
      : [defaultImage];

    let isMounted = true;

    const checkImage = (index) => {
      if (index >= sources.length) return;

      const img = document.createElement('img');
      img.src = sources[index];
      img.onload = () => {
        if (isMounted) setFinalSrc(sources[index]);
      };
      img.onerror = () => checkImage(index + 1);
    };

    checkImage(0);

    return () => {
      isMounted = false;
    };
  }, [basePath, defaultImage]);

  if (!finalSrc) {
    return (
      <div
        className='d-flex align-items-center m-auto'
        style={{ width, height }}
      >
        <Spinner type='grow' />
      </div>
    );
  }

  return (
    <NextImage
      className='rounded p-1'
      src={finalSrc}
      alt={title}
      width={width}
      height={height}
      style={{ objectFit }}
      loading='eager'
    />
  );
}
