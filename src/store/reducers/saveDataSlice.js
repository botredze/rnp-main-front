
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const initialState = {
};


const saveDataSlice = createSlice({
    name: "saveDataSlice",
    initialState,
    reducers: {
        clearDataUserFN: (state, action) => {
        },
    },
});
export const { } = saveDataSlice.actions;

export default saveDataSlice.reducer;
