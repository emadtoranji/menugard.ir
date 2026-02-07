'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ItemImage({
  category,
  title,
  defaultImage = null,
  width = 100,
  height = 100,
  objectFit = 'contain',
}) {
  const basePath = category ? `/images/items/${category}` : null;
  if (!defaultImage) {
    defaultImage = '/images/app-logo.webp';
  }

  const sources = basePath
    ? [`${basePath}.svg`, `${basePath}.webp`, `${basePath}.png`, defaultImage]
    : [defaultImage];

  const [srcIndex, setSrcIndex] = useState(0);

  return (
    <Image
      className='rounded p-1'
      src={sources[srcIndex]}
      alt={title}
      width={width}
      height={height}
      style={{ objectFit }}
      loading='eager'
      onError={() => {
        if (srcIndex < sources.length - 1) {
          setSrcIndex(srcIndex + 1);
        }
      }}
    />
  );
}
