import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { API_URL } from '../../components/env/env.js';

export const loginUser = createAsyncThunk('auth/login', async (loginData, { rejectWithValue }) => {
    console.log(loginData, 'loginData');
    try {
        const response = await axios.post(`${API_URL}/auth/login`, loginData);

        if (response.status === 201) {
            console.log(response.data, 'response.data');
            return response.data;
        }
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        loading: false,
        error: false,
        role: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.role = action.payload.role;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

const persistConfig = {
    key: 'auth',
    storage,
    whitelist: ['user', 'token'],
};

export const { logout } = authSlice.actions;

export default persistReducer(persistConfig, authSlice.reducer);
