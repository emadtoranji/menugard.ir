import { useContext } from 'react';
import { initialOrderState, OrderContext } from './context';

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  const { state, dispatch } = context;

  const setNote = (note) => dispatch({ type: 'SET_NOTE', payload: note });
  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const updateItem = (item) => dispatch({ type: 'UPDATE_ITEM', payload: item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const addOption = (itemId, option) =>
    dispatch({ type: 'ADD_OPTION', payload: { itemId, option } });
  const updateOption = (itemId, option) =>
    dispatch({ type: 'UPDATE_OPTION', payload: { itemId, option } });
  const removeOption = (itemId, optionId) =>
    dispatch({ type: 'REMOVE_OPTION', payload: { itemId, optionId } });
  const resetOrder = () => dispatch({ type: 'RESET_ORDER' });

  return {
    state: state || initialOrderState,
    setNote,
    addItem,
    updateItem,
    removeItem,
    addOption,
    updateOption,
    removeOption,
    resetOrder,
  };
}
