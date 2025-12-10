import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { API_URL } from '../../components/env/env.js';

export const loginUser = createAsyncThunk('auth/login', async (loginData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, loginData);
        return response.data;
    } catch (error) {
        // Обрабатываем разные типы ошибок
        if (error.response) {
            // Ошибка от сервера (4xx, 5xx)
            return rejectWithValue(
                error.response.data?.message || error.response.data?.error || 'Ошибка авторизации'
            );
        } else if (error.request) {
            // Запрос был отправлен, но ответа не было
            return rejectWithValue('Сервер не отвечает. Проверьте подключение');
        } else {
            // Ошибка при настройке запроса
            return rejectWithValue('Произошла ошибка при отправке запроса');
        }
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        loading: false,
        error: null,
        role: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.role = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.role = action.payload.role;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Неизвестная ошибка';
                state.user = null;
                state.token = null;
                state.role = null;
            });
    },
});

const persistConfig = {
    key: 'auth',
    storage,
    whitelist: ['user', 'token', 'role'],
};

export const { logout, clearError } = authSlice.actions;

export default persistReducer(persistConfig, authSlice.reducer);
