'use client';

import Loading from '@components/Loading/client';
import { createContext, useReducer, useEffect, useLayoutEffect } from 'react';

export const OrderContext = createContext(null);

export const initialOrderState = {
  items: [],
  totalPrice: 0,
  note: '',
};

export function orderReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;

    case 'SET_NOTE':
      return { ...state, note: action.payload };

    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };

    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, ...action.payload } : i,
        ),
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      };

    case 'ADD_OPTION':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.itemId
            ? { ...i, options: [...(i.options || []), action.payload.option] }
            : i,
        ),
      };

    case 'UPDATE_OPTION':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.itemId
            ? {
                ...i,
                options: i.options.map((o) =>
                  o.id === action.payload.option.id
                    ? { ...o, ...action.payload.option }
                    : o,
                ),
              }
            : i,
        ),
      };

    case 'REMOVE_OPTION':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.itemId
            ? {
                ...i,
                options: i.options.filter(
                  (o) => o.id !== action.payload.optionId,
                ),
              }
            : i,
        ),
      };

    case 'UPDATE_TOTAL_PRICE': {
      let finalPrice = 0;

      state.items.forEach((item) => {
        const quantity = item.quantity ?? 0;

        const itemDiscount = item.discountPercent ?? 0;
        const discountedItemPrice =
          item.price - (item.price * itemDiscount) / 100;

        const itemTotal = discountedItemPrice * quantity;

        let optionsTotal = 0;

        if (Array.isArray(item.options)) {
          item.options.forEach((option) => {
            const optionPrice = option.price ?? 0;
            const optionDiscount = option.discountPercent ?? 0;
            const optionCount = option.count ?? 1;

            const discountedOptionPrice =
              optionPrice - (optionPrice * optionDiscount) / 100;

            optionsTotal += discountedOptionPrice * optionCount;
          });
        }

        finalPrice += itemTotal + optionsTotal;
      });

      return { ...state, totalPrice: finalPrice };
    }

    case 'RESET':
    case 'RESET_ORDER':
      return initialOrderState;

    default:
      return state;
  }
}

function safeParseOrder(jsonString) {
  if (!jsonString) return null;
  try {
    const data = JSON.parse(jsonString);
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, null);

  useLayoutEffect(() => {
    const saved = localStorage.getItem('orderState');
    const parsed = safeParseOrder(saved);
    if (parsed) {
      dispatch({ type: 'HYDRATE', payload: parsed });
    } else {
      dispatch({ type: 'HYDRATE', payload: initialOrderState });
    }
  }, []);

  useEffect(() => {
    if (typeof state?.items === 'object')
      dispatch({ type: 'UPDATE_TOTAL_PRICE' });
  }, [state?.items]);

  useEffect(() => {
    if (state === null) return;

    try {
      localStorage.setItem('orderState', JSON.stringify(state));
    } catch {}
  }, [state]);

  if (state === null) return <Loading />;

  return (
    <OrderContext.Provider value={{ state, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
}
