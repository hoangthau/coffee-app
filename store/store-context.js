import { createContext, useContext, useReducer } from 'react';

const StoreContext = createContext();

export const ACTION_TYPES = {
  SET_LAT_LONG: 'SET_LAT_LONG',
  SET_COFFEE_STORES: 'SET_COFFEE_STORES',
};

export const StoreProvider = ({ children }) => {
  const initialState = {
    latLong: '',
    coffeeStores: null,
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};

function reducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_LAT_LONG: {
      return { ...state, latLong: action.payload };
    }
    case ACTION_TYPES.SET_COFFEE_STORES: {
      return { ...state, coffeeStores: action.payload };
    }
    default:
      throw new Error('reducer error');
  }
}

export const useStore = () => {
  return useContext(StoreContext);
};
