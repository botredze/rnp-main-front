import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const costPriceSlice = createSlice({
    name: 'costPriceSlice',
    initialState,

    reducers: {},
    extraReducers: (builder) => {
        builder.addCase('huid', (state, action) => (state.huid = action.payload));
    },
});

export const {} = costPriceSlice.actions;

export default costPriceSlice.reducer;
