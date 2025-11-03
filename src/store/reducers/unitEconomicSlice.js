import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../components/env/env.js';

const initialState = {
    selectedItemId: 0,
    selectedItem: {
        id: 0,
    },

    items: [],
    openDetailsState: false,
};

export const getProductListByOrganization = createAsyncThunk(
    'getProductListByOrganization',
    async (props, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/unit-economic/list`);

            if (response.status === 200) {
            }
        } catch (error) {
            return rejectWithValue(error.message);
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
            });
    },
});
export const { openCloseDetails, setSelectedItemId } = unitEconomicSlice.actions;
export default unitEconomicSlice.reducer;
