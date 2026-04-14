import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../components/api/axiosInstanse.js';

const initialState = {
    expenses: [],
    expensesTotal: 0,
    expensesTotalPages: 0,
    expensesTotalAmount: 0,
    articles: [],
    loading: false,
    articlesLoading: false,
    error: null,
};

export const getExpenses = createAsyncThunk(
    'otherExpenses/getExpenses',
    async (params, { rejectWithValue }) => {
        try {
            const query = new URLSearchParams();
            query.append('organizationId', params.organizationId);
            if (params.startDate) query.append('startDate', params.startDate);
            if (params.endDate) query.append('endDate', params.endDate);
            if (params.articleId) query.append('articleId', params.articleId);
            if (params.operationType) query.append('operationType', params.operationType);
            if (params.page) query.append('page', params.page);
            if (params.limit) query.append('limit', params.limit);

            const response = await axiosInstance.get(`/other-expenses?${query.toString()}`);
            if (response.status === 200) return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createExpense = createAsyncThunk(
    'otherExpenses/createExpense',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/other-expenses', data);
            if (response.status === 200 || response.status === 201) return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateExpense = createAsyncThunk(
    'otherExpenses/updateExpense',
    async ({ id, ...data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/other-expenses/${id}`, data);
            if (response.status === 200) return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteExpense = createAsyncThunk(
    'otherExpenses/deleteExpense',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/other-expenses/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getArticles = createAsyncThunk(
    'otherExpenses/getArticles',
    async (organizationId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/other-expenses/articles?organizationId=${organizationId}`
            );
            if (response.status === 200) return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createArticle = createAsyncThunk(
    'otherExpenses/createArticle',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/other-expenses/articles', data);
            if (response.status === 200 || response.status === 201) return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteArticle = createAsyncThunk(
    'otherExpenses/deleteArticle',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/other-expenses/articles/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const otherExpensesSlice = createSlice({
    name: 'otherExpenses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getExpenses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getExpenses.fulfilled, (state, action) => {
                state.loading = false;
                state.expenses = action.payload?.data || [];
                state.expensesTotal = action.payload?.total || 0;
                state.expensesTotalPages = action.payload?.totalPages || 0;
                state.expensesTotalAmount = action.payload?.totalAmount || 0;
            })
            .addCase(getExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(createExpense.fulfilled, (state, action) => {
                if (action.payload) {
                    state.expenses.unshift(action.payload);
                    state.expensesTotal += 1;
                }
            })

            .addCase(updateExpense.fulfilled, (state, action) => {
                if (action.payload) {
                    const idx = state.expenses.findIndex((e) => e.id === action.payload.id);
                    if (idx !== -1) state.expenses[idx] = action.payload;
                }
            })

            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.expenses = state.expenses.filter((e) => e.id !== action.payload);
                state.expensesTotal = Math.max(0, state.expensesTotal - 1);
            })

            .addCase(getArticles.pending, (state) => {
                state.articlesLoading = true;
            })
            .addCase(getArticles.fulfilled, (state, action) => {
                state.articlesLoading = false;
                state.articles = action.payload || [];
            })
            .addCase(getArticles.rejected, (state) => {
                state.articlesLoading = false;
            })

            .addCase(createArticle.fulfilled, (state, action) => {
                if (action.payload) state.articles.push(action.payload);
            })

            .addCase(deleteArticle.fulfilled, (state, action) => {
                state.articles = state.articles.filter((a) => a.id !== action.payload);
            });
    },
});

export default otherExpensesSlice.reducer;
