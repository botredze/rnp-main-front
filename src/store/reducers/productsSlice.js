import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedProduct: {
        id: 0,
    },
    loading: false,
    error: null,
    productList: [{ id: 0 }],
};

const productsSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},

    extraReducers: (builder) => {},
});
