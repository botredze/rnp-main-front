import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../components/env/env.js';
import axiosInstance from '../../components/api/axiosInstanse.js';

export const getUsersList = createAsyncThunk('users/get', async (filters, { rejectWithValue }) => {
    const { status, role, order } = filters;

    const params = new URLSearchParams();

    if (status) params.append('status', status);
    if (role) params.append('role', role);
    if (order) params.append('order', order);

    try {
        const response = await axiosInstance.get(`/users/list`, { params });

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const updateUserById = createAsyncThunk(
    'users/put',
    async (updateUserData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/users/update`, updateUserData);

            if (response.status === 201) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deactivateUser = createAsyncThunk(
    'users/diactive',
    async (deleteData, { rejectWithValue }) => {
        try {
            const { userId, action } = deleteData;

            const params = new URLSearchParams();

            params.append('userId', userId);
            params.append('status', action);

            const response = await axiosInstance.get(`/users/deactivate`, { params });

            if (response.status === 201) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createUser = createAsyncThunk('users/create', async (body, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/users/create`, body);

        if (response.status === 201) {
            return response.data;
        }
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const userSlice = createSlice({
    name: 'auth',
    initialState: {
        usersList: [],
        selectedUser: {},
        loading: false,
        error: false,
        addUserState: false,
        filterParams: {},
        viewOrganizationModal: false,
        editOrganizationModal: false,
    },
    reducers: {
        setAddUserState: (state, action) => {
            state.addUserState = action.payload;
        },

        setFilters: (state, action) => {
            state.filterParams = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },

        setViewOrganizationModal: (state, action) => {
            state.viewOrganizationModal = action.payload;
        },

        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        setEditOrganizationModal: (state, action) => {
            state.editOrganizationModal = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            //getUsers
            .addCase(getUsersList.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getUsersList.fulfilled, (state, action) => {
                state.loading = false;
                state.usersList = action.payload;
                state.error = false;
            })
            .addCase(getUsersList.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })

            //createUsers
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = false;
            })
            .addCase(createUser.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })

            //update user
            .addCase(updateUserById.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(updateUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.error = false;
            })
            .addCase(updateUserById.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })

            //delete user
            .addCase(deactivateUser.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(deactivateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = false;
            })
            .addCase(deactivateUser.rejected, (state) => {
                state.loading = false;
                state.error = true;
            });
    },
});

export const {
    setAddUserState,
    setFilters,
    setError,
    setEditOrganizationModal,
    setSelectedUser,
    setViewOrganizationModal,
} = userSlice.actions;
export default userSlice.reducer;
