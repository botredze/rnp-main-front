import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../components/api/axiosInstanse.js';

const initialState = {
    organization: {
        id: 0,
        organizationName: '',
    },
    selectedOrganization: {},
    loading: false,
    syncingOrgId: null,
    error: null,
    organizationList: [{ id: 0, organizationName: '' }],
    organizationListById: [],
    openCreateOrganizationState: false,
    editOrganizationOpenState: false,
    basicAnalytic: null,
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
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const diactiveOrganization = createAsyncThunk(
    'organization/createOrganization',
    async (organization, { rejectWithValue }) => {
        const { organizationId, action } = organization;
        const params = new URLSearchParams();

        params.append('organizationId', organizationId);
        params.append('action', action);

        try {
            const response = await axiosInstance.get(`/organization/deactivate`, { params });

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const triggerOrganizationSync = createAsyncThunk(
    'organization/triggerSync',
    async (organizationId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/organization/sync`, { organizationId });

            if (response.status === 200 || response.status === 201) {
                return { organizationId, ...response.data };
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getOrganizationBasicAnalytics = createAsyncThunk(
    'organization/getOrganizationBasicAnalytics',
    async (query, { rejectWithValue }) => {
        const params = new URLSearchParams();

        console.log(query, ' query');
        const { organizationId } = query;

        if (organizationId) {
            params.append('organizationId', organizationId);
        }

        try {
            const response = await axiosInstance.get(`/rnp-statistic/basic`, { params });

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
            })

            //create organizations
            .addCase(diactiveOrganization.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(diactiveOrganization.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(diactiveOrganization.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //triggerOrganizationSync
            .addCase(triggerOrganizationSync.pending, (state, action) => {
                state.syncingOrgId = action.meta.arg;
                state.error = null;
            })
            .addCase(triggerOrganizationSync.fulfilled, (state) => {
                state.syncingOrgId = null;
            })
            .addCase(triggerOrganizationSync.rejected, (state, action) => {
                state.syncingOrgId = null;
                state.error = action.payload;
            })

            //getOrganizationBasicAnalytics
            .addCase(getOrganizationBasicAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrganizationBasicAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.basicAnalytic = action.payload;
            })
            .addCase(getOrganizationBasicAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
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
