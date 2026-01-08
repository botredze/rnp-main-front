import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../components/api/axiosInstanse.js';

const initialState = {
    // Данные отчетов
    dashboardData: null,
    summaryReportData: null,
    pnlReportData: null,
    availableDates: null,

    // Состояния загрузки
    dashboardLoading: false,
    summaryLoading: false,
    pnlLoading: false,
    uploadLoading: false,
    datesLoading: false,

    // Ошибки
    dashboardError: null,
    summaryError: null,
    pnlError: null,
    uploadError: null,
    datesError: null,

    // Выбранный период
    selectedDateRange: {
        startDate: null,
        endDate: null,
    },

    detailedReportData: null,
    detailedReportLoading: false,
    detailedReportError: null,
    filterOptions: {
        sizes: [],
        warehouses: [],
    },
};

/**
 * Загрузить детализированный отчет
 */
export const uploadDetailedReport = createAsyncThunk(
    'reports/uploadDetailedReport',
    async ({ file, organizationId }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('organizationId', organizationId);

            const response = await axiosInstance.post('/reports/detailed/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200 || response.status === 201) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

/**
 * Загрузить еженедельный отчет
 */
export const uploadWeeklyReport = createAsyncThunk(
    'reports/uploadWeeklyReport',
    async ({ file, organizationId }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('organizationId', organizationId);

            const response = await axiosInstance.post('/reports/weekly/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200 || response.status === 201) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

/**
 * Получить доступные даты отчетов
 */
export const getAvailableDates = createAsyncThunk(
    'reports/getAvailableDates',
    async (organizationId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/reports/available-dates/${organizationId}`);

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

/**
 * Получить дашборд
 */
export const getOrganizationDashboard = createAsyncThunk(
    'reports/getOrganizationDashboard',
    async ({ organizationId, startDate, endDate }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            params.append('organizationId', organizationId);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await axiosInstance.get(`/reports/dashboard?${params.toString()}`);

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

/**
 * Получить сводный отчет
 */
export const getOrganizationSummaryReport = createAsyncThunk(
    'reports/getOrganizationSummaryReport',
    async ({ organizationId, startDate, endDate }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            params.append('organizationId', organizationId);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await axiosInstance.get(`/reports/summary?${params.toString()}`);

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

/**
 * Получить PnL отчет (пока заглушка)
 */
export const getOrganizationPnLReport = createAsyncThunk(
    'reports/getOrganizationPnLReport',
    async ({ organizationId, startDate, endDate }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            params.append('organizationId', organizationId);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await axiosInstance.get(`/reports/pnl?${params.toString()}`);

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getDetailedReport = createAsyncThunk(
    'reports/getDetailedReport',
    async (params, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('organizationId', params.organizationId);
            if (params.startDate) queryParams.append('startDate', params.startDate);
            if (params.endDate) queryParams.append('endDate', params.endDate);
            if (params.size) queryParams.append('size', params.size);
            if (params.documentType) queryParams.append('documentType', params.documentType);
            if (params.warehouse) queryParams.append('warehouse', params.warehouse);
            if (params.searchQuery) queryParams.append('searchQuery', params.searchQuery);
            if (params.page) queryParams.append('page', params.page);
            if (params.limit) queryParams.append('limit', params.limit);

            const response = await axiosInstance.get(`/reports/detailed?${queryParams.toString()}`);

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getDetailedReportFilterOptions = createAsyncThunk(
    'reports/getDetailedReportFilterOptions',
    async (organizationId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/reports/detailed/filter-options/${organizationId}`
            );

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const reportsSlice = createSlice({
    name: 'reports',
    initialState,

    reducers: {
        setSelectedDateRange: (state, action) => {
            state.selectedDateRange = action.payload;
        },
        clearDashboardData: (state) => {
            state.dashboardData = null;
            state.dashboardError = null;
        },
        clearSummaryData: (state) => {
            state.summaryReportData = null;
            state.summaryError = null;
        },
        clearPnLData: (state) => {
            state.pnlReportData = null;
            state.pnlError = null;
        },
        clearUploadError: (state) => {
            state.uploadError = null;
        },
        clearAllErrors: (state) => {
            state.dashboardError = null;
            state.summaryError = null;
            state.pnlError = null;
            state.uploadError = null;
            state.datesError = null;
        },
    },

    extraReducers: (builder) => {
        // ========== uploadDetailedReport ==========
        builder
            .addCase(uploadDetailedReport.pending, (state) => {
                state.uploadLoading = true;
                state.uploadError = null;
            })
            .addCase(uploadDetailedReport.fulfilled, (state, action) => {
                state.uploadLoading = false;
                console.log('Detailed report uploaded:', action.payload);
            })
            .addCase(uploadDetailedReport.rejected, (state, action) => {
                state.uploadLoading = false;
                state.uploadError = action.payload;
            });

        // ========== uploadWeeklyReport ==========
        builder
            .addCase(uploadWeeklyReport.pending, (state) => {
                state.uploadLoading = true;
                state.uploadError = null;
            })
            .addCase(uploadWeeklyReport.fulfilled, (state, action) => {
                state.uploadLoading = false;
                console.log('Weekly report uploaded:', action.payload);
            })
            .addCase(uploadWeeklyReport.rejected, (state, action) => {
                state.uploadLoading = false;
                state.uploadError = action.payload;
            });

        // ========== getAvailableDates ==========
        builder
            .addCase(getAvailableDates.pending, (state) => {
                state.datesLoading = true;
                state.datesError = null;
            })
            .addCase(getAvailableDates.fulfilled, (state, action) => {
                state.datesLoading = false;
                state.availableDates = action.payload;
            })
            .addCase(getAvailableDates.rejected, (state, action) => {
                state.datesLoading = false;
                state.datesError = action.payload;
            });

        // ========== getOrganizationDashboard ==========
        builder
            .addCase(getOrganizationDashboard.pending, (state) => {
                state.dashboardLoading = true;
                state.dashboardError = null;
            })
            .addCase(getOrganizationDashboard.fulfilled, (state, action) => {
                state.dashboardLoading = false;
                state.dashboardData = action.payload;
            })
            .addCase(getOrganizationDashboard.rejected, (state, action) => {
                state.dashboardLoading = false;
                state.dashboardError = action.payload;
            });

        // ========== getOrganizationSummaryReport ==========
        builder
            .addCase(getOrganizationSummaryReport.pending, (state) => {
                state.summaryLoading = true;
                state.summaryError = null;
            })
            .addCase(getOrganizationSummaryReport.fulfilled, (state, action) => {
                state.summaryLoading = false;
                state.summaryReportData = action.payload;
            })
            .addCase(getOrganizationSummaryReport.rejected, (state, action) => {
                state.summaryLoading = false;
                state.summaryError = action.payload;
            });

        // ========== getOrganizationPnLReport ==========
        builder
            .addCase(getOrganizationPnLReport.pending, (state) => {
                state.pnlLoading = true;
                state.pnlError = null;
            })
            .addCase(getOrganizationPnLReport.fulfilled, (state, action) => {
                state.pnlLoading = false;
                state.pnlReportData = action.payload;
            })
            .addCase(getOrganizationPnLReport.rejected, (state, action) => {
                state.pnlLoading = false;
                state.pnlError = action.payload;
            });
        builder
            .addCase(getDetailedReport.pending, (state) => {
                state.detailedReportLoading = true;
                state.detailedReportError = null;
            })
            .addCase(getDetailedReport.fulfilled, (state, action) => {
                state.detailedReportLoading = false;
                state.detailedReportData = action.payload;
            })
            .addCase(getDetailedReport.rejected, (state, action) => {
                state.detailedReportLoading = false;
                state.detailedReportError = action.payload;
            })
            .addCase(getDetailedReportFilterOptions.fulfilled, (state, action) => {
                state.filterOptions = action.payload;
            });
    },
});

export const {
    setSelectedDateRange,
    clearDashboardData,
    clearSummaryData,
    clearPnLData,
    clearUploadError,
    clearAllErrors,
} = reportsSlice.actions;

export default reportsSlice.reducer;
