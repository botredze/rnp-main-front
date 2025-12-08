import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../components/env/env.js';
import axiosInstance from '../../components/api/axiosInstanse.js';

const initialState = {
    selectedItemId: 0,
    selectedItem: {
        id: 0,
    },
    loading: false,
    error: null,
    items: [],
    openDetailsState: false,
    openCloseCreateState: false,
};

export const getProductListByOrganization = createAsyncThunk(
    'getProductListByOrganization',
    async (props, { dispatch, rejectWithValue }) => {
        const { organizationId } = props;
        try {
            const response = await axiosInstance.get(
                `/unit-economic/list?organizationId=${organizationId}`
            );

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getProductById = createAsyncThunk(
    'getProductById',
    async (props, { dispatch, rejectWithValue }) => {
        const { productId } = props;
        try {
            const response = await axiosInstance.get(`/unit-economic?productId=${productId}`);

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createProductByOrganization = createAsyncThunk(
    'unitEconomic/createProductByOrganization',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/unit-economic/create`, formData);

            if (response.status === 201) {
                return response.data;
            } else {
                return rejectWithValue('Ошибка сервера: ' + response.status);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const unitEconomicSlice = createSlice({
    name: 'unitEconomicSlice',
    initialState,
    reducers: {
        openCloseDetails: (state, action) => {
            state.openDetailsState = action.payload;
        },

        setOpenCloseCreateState: (state, action) => {
            state.openCloseCreateState = action.payload;
        },

        setSelectedItemId: (state, action) => {
            state.selectedItemId = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getProductListByOrganization.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductListByOrganization.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(getProductListByOrganization.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(createProductByOrganization.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProductByOrganization.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(createProductByOrganization.rejected, (state, action) => {
                state.loading = false;
                state.error = 'Ошибка нахуй';
            })

            .addCase(getProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.selectedItem = action.payload;
            })
            .addCase(getProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = 'Ошибка нахуй';
            });
    },
});
export const { openCloseDetails, setSelectedItemId, setOpenCloseCreateState } =
    unitEconomicSlice.actions;
export default unitEconomicSlice.reducer;
