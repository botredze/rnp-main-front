import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../components/api/axiosInstanse.js';

const initialState = {
    selectedProduct: {
        id: 0,
    },
    loading: false,
    error: null,
    productList: [{ id: 0 }],
    rnpStatistic: [],
    selectedTimePeriod: 'week',
    selectedDates: null,
};

export const getOrganizationProductLis = createAsyncThunk(
    'products/getOrganizationProductLis',
    async (props, { rejectWithValue }) => {
        const { organizationId } = props;
        try {
            const response = await axiosInstance.get(
                `/rnp-statistic/list?organizationId=${organizationId}`
            );

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getProductRnpStatistic = createAsyncThunk(
    'products/getProductRnpStatistic',
    async (props, { rejectWithValue }) => {
        const { productId, timePeriod, startDate, endDate } = props;

        const params = new URLSearchParams();

        params.append('productId', productId);

        if (!timePeriod) {
            throw new Error('Параметр "timePeriod" обязателен');
        }

        params.append('periodTypes', timePeriod);

        if (timePeriod === 'custom') {
            if (!startDate || !endDate) {
                throw new Error('Для "custom" периода нужно указать startDate и endDate');
            }
            params.append('startDate', startDate);
            params.append('endDate', endDate);
        }

        try {
            const response = await axiosInstance.get(`/rnp-statistic/stats`, { params });

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const productsSlice = createSlice({
    name: 'productsSlice',
    initialState,
    reducers: {
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        },

        setSelectedTimePeriod: (state, action) => {
            state.selectedTimePeriod = action.payload;
        },

        setSelectedDates: (state, action) => {
            state.selectedDates = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getOrganizationProductLis.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrganizationProductLis.fulfilled, (state, action) => {
                state.loading = false;
                state.productList = action.payload;
            })
            .addCase(getOrganizationProductLis.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getProductRnpStatistic.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductRnpStatistic.fulfilled, (state, action) => {
                state.loading = false;
                state.rnpStatistic = action.payload;
            })
            .addCase(getProductRnpStatistic.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setSelectedProduct, setSelectedTimePeriod, setSelectedDates } =
    productsSlice.actions;

export default productsSlice.reducer;
