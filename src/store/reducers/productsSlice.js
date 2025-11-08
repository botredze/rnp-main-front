import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../components/api/axiosInstanse.js';

const initialState = {
    selectedProduct: {
        id: 0,
    },
    loading: false,
    error: null,
    productList: [{ id: 0 }],
};

export const getOrganizationProductLis = createAsyncThunk(
    'products/getOrganizationProductLis',
    async (props, { rejectWithValue }) => {
        const { organizationId } = props;
        try {
            const response = await axiosInstance.get(
                `/rnp-statistic/list?organizationId=${organizationId}`
            );

            console.log(response.data);
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
    reducers: {},

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
            });
    },
});

export default productsSlice.reducer;
