'use client';

import Loading from '@components/Loading/client';
import { STORE_CONTEXT_HOURS_FRESH } from '@utils/globalSettings';
import { hourToSecond } from '@utils/numbers';
import { createContext, useReducer, useEffect, useLayoutEffect } from 'react';

export const OrderContext = createContext(null);

export const initialOrderState = {
  store: {},
  items: [],
  totalPrice: 0,
  taxPrice: 0,
  initDate: Date.now(),
  note: '',
};

export function orderReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;

    case 'SET_STORE':
      return { ...state, store: action.payload };

    case 'SET_NOTE':
      return { ...state, note: action.payload };

    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
        initDate: Date.now(),
      };

    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, ...action.payload } : i,
        ),
        initDate: Date.now(),
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
        initDate: Date.now(),
      };

    case 'ADD_OPTION':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.itemId
            ? { ...i, options: [...(i.options || []), action.payload.option] }
            : i,
        ),
        initDate: Date.now(),
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
        initDate: Date.now(),
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
        initDate: Date.now(),
      };

    case 'UPDATE_TOTAL_PRICE': {
      let itemsPrice = 0;
      let taxPrice = 0;
      if (Array.isArray(state?.items)) {
        state.items.forEach((item) => {
          const quantity = item?.quantity ?? 0;
          if (quantity && item?.isActive && item?.isAvailable) {
            const itemDiscount = item?.discountPercent ?? 0;

            const discountedItemPrice =
              item.price - (item.price * itemDiscount) / 100;

            const itemTotal = discountedItemPrice * quantity;
            let optionsTotal = 0;
            if (Array.isArray(item?.options)) {
              item.options.forEach((option) => {
                const optionCount = option?.count ?? 0;
                if (optionCount && option?.isActive) {
                  const optionPrice = option.price ?? 0;
                  const optionDiscount = option?.discountPercent ?? 0;

                  const discountedOptionPrice =
                    optionPrice - (optionPrice * optionDiscount) / 100;

                  optionsTotal += discountedOptionPrice * optionCount;
                }
              });
            }

            itemsPrice += itemTotal + optionsTotal;
          }
        });
      }

      if (
        state?.store?.taxEnabled &&
        !state?.store?.taxIncluded &&
        Number(state?.store?.taxPercent) &&
        state.store.taxPercent > 0
      ) {
        taxPrice = (itemsPrice * state.store.taxPercent) / 100;
      }

      return {
        ...state,
        taxPrice,
        itemsPrice,
        totalPrice: itemsPrice + taxPrice,
        initDate: Date.now(),
      };
    }

    case 'RESET_ORDER':
      return { ...initialOrderState, store: state.store };

    case 'RESET_STATE':
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
      const initDate = parseInt(parsed?.initDate) || 0;
      let contextIsFresh = true;
      const nowDate = Date.now();
      if (
        initDate + hourToSecond(STORE_CONTEXT_HOURS_FRESH) * 1000 <=
        nowDate
      ) {
        contextIsFresh = false;
      }

      dispatch({
        type: 'HYDRATE',
        payload: contextIsFresh ? parsed : initialOrderState,
      });
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
