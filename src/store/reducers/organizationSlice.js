import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../components/api/axiosInstanse.js';

const initialState = {
    organization: {
        id: 0,
        organizationName: '',
    },
    loading: false,
    error: null,
    organizationList: [{ id: 0, organizationName: '' }],
};

export const getOrganizationList = createAsyncThunk(
    'organization/getOrganizationList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/organization/list`);

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const organizationSlice = createSlice({
    name: 'organization',
    initialState,
    reducers: {
        setSelectedOrganization: (state, action) => {
            state.organization = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOrganizationList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrganizationList.fulfilled, (state, action) => {
                state.loading = false;
                state.organizationList = action.payload;
            })
            .addCase(getOrganizationList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setSelectedOrganization } = organizationSlice.actions;
export default organizationSlice.reducer;
