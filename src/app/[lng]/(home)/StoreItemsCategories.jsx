'use client';

import { useEffect, useRef } from 'react';
import { storeItemsCategoriesKey } from '@lib/prismaEnums';
import { useT } from '@i18n/client';

export default function StoreItemsCategories() {
  const { t } = useT('store-item-categories');
  const trackRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    let animationFrame;
    let start = null;
    const speed = 50;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = (timestamp - start) / 1000;
      const distance = elapsed * speed;
      const width = track.scrollWidth;

      const x = distance % width;
      track.style.transform = `translateX(${x}px)`;

      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const items = [
    ...storeItemsCategoriesKey,
    ...storeItemsCategoriesKey,
    ...storeItemsCategoriesKey,
    ...storeItemsCategoriesKey,
    ...storeItemsCategoriesKey,
    ...storeItemsCategoriesKey,
    ...storeItemsCategoriesKey,
    ...storeItemsCategoriesKey,
    ...storeItemsCategoriesKey,
    ...storeItemsCategoriesKey,
  ];

  return (
    <section
      id='item-categories'
      className='container-fluid bg-white mt-5 py-1 position-absolute bottom-0 text-active'
    >
      <div ref={containerRef} className='marquee-container'>
        <div ref={trackRef} className='marquee-track d-inline-flex gap-5'>
          {items.map((category, i) => (
            <span className='text-nowrap fw-bold' key={i}>
              {t(category, category)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
