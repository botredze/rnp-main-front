// costPriceSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../components/api/axiosInstanse.js';

const initialState = {
    productsList: [],
    productCostPricesMap: {}, // Храним цены по productId
    productSizePricesMap: {}, // Храним цены по размерам: { productId: { size: price } }
    selectedProduct: null,
    costPrices: null,
    loading: false,
    error: null,
    stats: null,
};

// Получить все продукты с ценами организации
export const getProductsWithCostPrice = createAsyncThunk(
    'costPrice/getProductsWithCostPrice',
    async (props, { rejectWithValue }) => {
        const { organizationId } = props;
        try {
            const response = await axiosInstance.get(`/cost-prices/organization/${organizationId}`);

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            console.error('API Error:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Получить детальную информацию о ценах продукта (включая размеры)
export const getProductCostPrice = createAsyncThunk(
    'costPrice/getProductCostPrice',
    async (props, { rejectWithValue }) => {
        const { productId, includeHistory = false } = props;
        try {
            const response = await axiosInstance.get(
                `/cost-prices/product/${productId}?includeHistory=${includeHistory}`
            );

            if (response.status === 200) {
                return { productId, ...response.data };
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Получить цены по размерам для нескольких продуктов
export const getBulkProductSizePrices = createAsyncThunk(
    'costPrice/getBulkProductSizePrices',
    async (props, { rejectWithValue }) => {
        const { productIds } = props;
        try {
            const promises = productIds.map((productId) =>
                axiosInstance.get(`/cost-prices/product/${productId}`)
            );

            const responses = await Promise.all(promises);

            return responses.map((response, index) => ({
                productId: productIds[index],
                data: response.data,
            }));
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addProductCostPrice = createAsyncThunk(
    'costPrice/addProductCostPrice',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/cost-prices', formData);

            if (response.status === 200 || response.status === 201) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateProductCostPrice = createAsyncThunk(
    'costPrice/updateProductCostPrice',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/cost-prices/${id}`, data);

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deactivateCostPrice = createAsyncThunk(
    'costPrice/deactivateCostPrice',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/cost-prices/${id}/deactivate`);

            if (response.status === 200) {
                return { id, ...response.data };
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const costPriceSlice = createSlice({
    name: 'costPrice',
    initialState,

    reducers: {
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        },
        clearCostPrices: (state) => {
            state.costPrices = null;
            state.selectedProduct = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        // getProductsWithCostPrice
        builder
            .addCase(getProductsWithCostPrice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductsWithCostPrice.fulfilled, (state, action) => {
                state.loading = false;
                state.productsList = action.payload.data || [];

                console.log('=== getProductsWithCostPrice fulfilled ===');
                console.log('Full payload:', action.payload);

                const pricesMap = { ...state.productCostPricesMap };

                if (action.payload.data && Array.isArray(action.payload.data)) {
                    action.payload.data.forEach((item) => {
                        if (item.product && item.product.id) {
                            if (item.productLevelPrice) {
                                pricesMap[item.product.id] = item.productLevelPrice;
                                console.log(
                                    `✓ Product ${item.product.id} has price:`,
                                    item.productLevelPrice
                                );
                            } else {
                                console.log(`✗ Product ${item.product.id} has NO price (null)`);
                                if (!pricesMap[item.product.id]) {
                                    pricesMap[item.product.id] = null;
                                }
                            }
                        }
                    });
                }

                console.log('Final pricesMap:', pricesMap);
                state.productCostPricesMap = pricesMap;
            })
            .addCase(getProductsWithCostPrice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        // getProductCostPrice
        builder
            .addCase(getProductCostPrice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductCostPrice.fulfilled, (state, action) => {
                state.loading = false;
                state.costPrices = action.payload.costPrices;
                state.stats = action.payload.stats;

                const productId = action.payload.product?.id;

                console.log('=== getProductCostPrice fulfilled ===');
                console.log('productId:', productId);
                console.log('costPrices:', action.payload.costPrices);

                // Обновляем цену продукта в Map
                if (productId && action.payload.costPrices?.productLevel) {
                    state.productCostPricesMap = {
                        ...state.productCostPricesMap,
                        [productId]: action.payload.costPrices.productLevel,
                    };
                    console.log(
                        `✓ Updated price for product ${productId}:`,
                        action.payload.costPrices.productLevel
                    );
                } else {
                    console.log('✗ No productLevel price found');
                }

                // Обновляем цены по размерам
                if (
                    productId &&
                    action.payload.costPrices?.bySize &&
                    action.payload.costPrices.bySize.length > 0
                ) {
                    if (!state.productSizePricesMap[productId]) {
                        state.productSizePricesMap[productId] = {};
                    }
                    action.payload.costPrices.bySize.forEach((sizePrice) => {
                        state.productSizePricesMap[productId][sizePrice.size] = sizePrice;
                    });
                }
            })
            .addCase(getProductCostPrice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        // getBulkProductSizePrices
        builder
            .addCase(getBulkProductSizePrices.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBulkProductSizePrices.fulfilled, (state, action) => {
                state.loading = false;

                action.payload.forEach(({ productId, data }) => {
                    if (data.costPrices.bySize && data.costPrices.bySize.length > 0) {
                        if (!state.productSizePricesMap[productId]) {
                            state.productSizePricesMap[productId] = {};
                        }
                        data.costPrices.bySize.forEach((sizePrice) => {
                            state.productSizePricesMap[productId][sizePrice.size] = sizePrice;
                        });
                    }
                });
            })
            .addCase(getBulkProductSizePrices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // addProductCostPrice
        builder
            .addCase(addProductCostPrice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProductCostPrice.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(addProductCostPrice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // updateProductCostPrice
        builder
            .addCase(updateProductCostPrice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProductCostPrice.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateProductCostPrice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // deactivateCostPrice
        builder
            .addCase(deactivateCostPrice.pending, (state) => {
                state.loading = true;
            })
            .addCase(deactivateCostPrice.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(deactivateCostPrice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setSelectedProduct, clearCostPrices, clearError } = costPriceSlice.actions;

export default costPriceSlice.reducer;
