import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import unitEconomicSlice from './reducers/unitEconomicSlice';
import organizationSlice from './reducers/organizationSlice';
import authSlice from './reducers/authSlice';
import productsSlice from './reducers/productsSlice.js';
import usersSlice from './reducers/usersSlice.js';
import costPriceSlice from './reducers/costPriceSlice.js';
import reportsSlice from './reducers/reportsSlice.js';
import otherExpensesSlice from './reducers/otherExpensesSlice.js';

const rootReducer = combineReducers({
    auth: authSlice,
    unitEconomic: unitEconomicSlice,
    organization: organizationSlice,
    products: productsSlice,
    users: usersSlice,
    costPrice: costPriceSlice,
    reports: reportsSlice,
    otherExpenses: otherExpensesSlice,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
