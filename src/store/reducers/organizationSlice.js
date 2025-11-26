import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../components/api/axiosInstanse.js';

const initialState = {
    organization: {
        id: 0,
        organizationName: '',
    },
    selectedOrganization: {},
    loading: false,
    error: null,
    organizationList: [{ id: 0, organizationName: '' }],
    organizationListById: [],
    openCreateOrganizationState: false,
    editOrganizationOpenState: false,
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

        const { userId } = query;

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

export const updateOrganizationById = createAsyncThunk(
    'organization/updateOrganizationById',
    async (organization, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/organization/update`, organization);

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createOrganization = createAsyncThunk(
    'organization/createOrganization',
    async (organization, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/organization/create`, organization);

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
        setOpenCreateOrganizationState: (state, action) => {
            state.openCreateOrganizationState = action.payload;
        },
        setEditOrganizationOpenState: (state, action) => {
            state.editOrganizationOpenState = action.payload;
        },
        setSelectedEditOrganization: (state, action) => {
            state.selectedOrganization = action.payload;
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

        // //create organizations
        // .addCase(getOrganizationListByUserId.pending, (state) => {
        //     state.loading = true;
        //     state.error = null;
        // })
        // .addCase(getOrganizationListByUserId.fulfilled, (state, action) => {
        //     state.loading = false;
        //     state.organizationListById = action.payload;
        // })
        // .addCase(getOrganizationListByUserId.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload;
        // })
        //
        // //updateOrganizationById
        // .addCase(getOrganizationListByUserId.pending, (state) => {
        //     state.loading = true;
        //     state.error = null;
        // })
        // .addCase(getOrganizationListByUserId.fulfilled, (state, action) => {
        //     state.loading = false;
        //     state.organizationListById = action.payload;
        // })
        // .addCase(getOrganizationListByUserId.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload;
        // })
        // //diactive organization
        // .addCase(getOrganizationListByUserId.pending, (state) => {
        //     state.loading = true;
        //     state.error = null;
        // })
        // .addCase(getOrganizationListByUserId.fulfilled, (state, action) => {
        //     state.loading = false;
        //     state.organizationListById = action.payload;
        // })
        // .addCase(getOrganizationListByUserId.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload;
        // });
    },
});

export const {
    setSelectedOrganization,
    setOpenCreateOrganizationState,
    setEditOrganizationOpenState,
    setSelectedEditOrganization,
} = organizationSlice.actions;
export default organizationSlice.reducer;
