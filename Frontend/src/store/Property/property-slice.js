//state manager
//all list properties
//count properties
//search filters
//loading flag
//error detection and displaying it 

import { createSlice } from "@reduxjs/toolkit";

const propertySlice = createSlice({
    name: "property",

    initialState: {
        properties: [],  //properties from backend are being fetched here 
        totalProperties: 0,  //initially dont know how many propertis so keep it 0 for safer side ,if more it will get added ot 0 later
        searchParams: {},
        error: null,
        loading: false

    },
    //reducers are the functions that are allowed to change the state
    reducers: {
        getRequest(state) {    //to get the prorperties
            state.loading = true;
        },
        getProperties(state, action) {
            state.properties = action.payload.data;
            state.totalProperties = action.payload.all_properties;
            state.loading = false; //request finished=>hide the loader

        },

        updateSearchParams: (state, action) => {
            state.searchParams = Object.keys(action.payload).length === 0 ? {} : {
                ...state.searchParams,
                ...action.payload
            }
        },
        getErrors(state, action) {
            state.error = action.payload
        }

    }

})

export const propertyAction = propertySlice.actions

export default propertySlice;