'use client';

import Loading from '@components/Loading/client';
import { createContext, useReducer, useEffect, useLayoutEffect } from 'react';

export const OrderContext = createContext(null);

export const initialOrderState = {
  items: [],
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
