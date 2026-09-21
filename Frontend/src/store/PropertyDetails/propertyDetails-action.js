import { propertyDetailsActions } from "./propertyDetails-slice.js"
import { axiosInstance } from "../../utils/axios.js"

//fetch details of one specific property using its id

//receive the property id
//start loading
//call backend api
//wait for response
//get the property data
//store the details in redux 
//if error store error in redux


export const getPropertyDetails = (id) => async (dispatch) => {

    try {
        dispatch(propertyDetailsActions.getListRequest());
        const response = await axiosInstance.get(`/v1/rent/listing/${id}`);
        console.log(response);
        if (!response) {
            throw new Error("Could not fetch any propertyDetails");
        }
        const data = response.data;
        dispatch(propertyDetailsActions.getPropertyDetails(data));
    } catch (error) {
        dispatch(propertyDetailsActions.getErrors(error.response.data.error));
    }

}