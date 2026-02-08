import { useOrder } from '@context/notes/order/useOrder';
import { useEffect } from 'react';

export default function SetStoreToContext({ store }) {
  const { state, setStore, resetOrder } = useOrder();

  useEffect(() => {
    if (typeof store !== 'object') return;

    if (typeof state?.store !== 'object') {
      resetOrder();
    }

    setStore(store);
  }, [store, state?.store, resetOrder, setStore]);

  return null;
}
