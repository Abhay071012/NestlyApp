import { propertyAction } from './property-slice.js';
import { axiosInstance } from '../../utils/axios';

//get all properties
//1.start api req
//2.tell redux loading started
//3,get seaech parameters
//4.call backend api
//5.wait for response
//6.get property data
//7.send data to redux store
//8.if error occurs then send error to redux

// dispatch=>send to redux
//getState=>get the date from  redux 
export const getAllProperties = () => async (dispatch, getState) => {

    try {
        console.log("API call started");

        dispatch(propertyAction.getRequest())

        const { searchParams } = getState().properties
        console.log(searchParams);
        const response = await axiosInstance.get(`/v1/rent/listing`, {
            params: { ...searchParams }
        })
        if (!response) {
            throw new Error("could not fetch any property")
        }

        const { data } = response;
        console.log(data);

        dispatch(propertyAction.getProperties(data))

    } catch (error) {

        dispatch(propertyAction.getErrors(error.message))
    }
}