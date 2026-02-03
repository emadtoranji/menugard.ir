'use client';

import { useEffect } from 'react';
import { hourToSecond } from '@utils/numbers';
import { getCookieDocument, setCookieDocument } from '@utils/cookie';

export default function Log({
  storeId = null,
  tableId = null,
  source = 'unknown',
  ipAddress = null,
}) {
  useEffect(() => {
    if (!storeId) return;

    const cookieName = `store-explorer-log-${storeId}`;
    const lastRequest = parseInt(getCookieDocument(cookieName) || '0');
    const expireTime = hourToSecond(3) * 1000;
    const now = Date.now();

    if (!lastRequest || now - lastRequest > expireTime) {
      (async () => {
        try {
          await fetch('/api/store/handle-explorer-log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              storeId,
              tableId,
              source,
              ipAddress,
            }),
          });

          setCookieDocument(cookieName, String(Date.now()), hourToSecond(3));
        } catch {}
      })();
    }
  }, [storeId, tableId, source, ipAddress]);

  return null;
}
