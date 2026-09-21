//propertyDetails

//create a slice name
//create intialt state
//request starts
//property data received
//errors occurs
//export actions
//export slice

import { createSlice } from "@reduxjs/toolkit";

const propertyDetailsSlice = createSlice({
    name: "propertyDetails",
    initialState: {
        propertyDetails: null,
        loading: false,
        error: null
    },
    reducers: {
        getListRequest(state) {
            state.loading = true;
        },
        getPropertyDetails(state, action) {
            state.propertyDetails = action.payload.data;
            state.loading = false;
        },
        getErrors(state, action) {
            state.error = action.payload;
            state.loading = false;
        }
    }
})

export const propertyDetailsActions = propertyDetailsSlice.actions;
export default propertyDetailsSlice;