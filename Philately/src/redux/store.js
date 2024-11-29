import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice.js';
import cartReducer from './cart/cartSlice.js';
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['user', 'cart']
};

const persistedReducer = persistReducer(persistConfig, 
  combineReducers({
    user: userReducer,
    cart: cartReducer,
  })
);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  })
})

export const persistor = persistStore(store);