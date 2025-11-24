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
    organizationListById: [],
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

export const getOrganizationListByUserId = createAsyncThunk(
    'organization/getOrganizationListById',
    async (query, { rejectWithValue }) => {
        const params = new URLSearchParams();

        console.log(query, 'query');
        const { userId } = query;
        console.log(userId, 'userId');

        if (userId) {
            params.append('userId', userId);
        }

        try {
            const response = await axiosInstance.get(`/organization/list`, { params });

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
            //organizationList
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
            })
            //organizationListById
            .addCase(getOrganizationListByUserId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrganizationListByUserId.fulfilled, (state, action) => {
                state.loading = false;
                state.organizationListById = action.payload;
            })
            .addCase(getOrganizationListByUserId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setSelectedOrganization } = organizationSlice.actions;
export default organizationSlice.reducer;
