import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const reportsSlice = createSlice({
    name: 'reportsSlice',
    initialState,

    reducers: {},
    extraReducers: (builder) => {
        builder.addCase('huid', (state, action) => (state.huid = action.payload));
    },
});

export const {} = reportsSlice.actions;

export default reportsSlice.reducer;
