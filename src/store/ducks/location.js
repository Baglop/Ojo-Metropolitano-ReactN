import { createActions, createReducer } from "reduxsauce";
import { getStore } from "../store";
import PouchDB from 'pouchdb-react-native';
const db = new PouchDB('OjoMetropolitano');

export const { Types, Creators } = createActions({
    fetchLocation: ['location']
})

const ININTIAL_STATE = {
    location: null
}

export const getLocation = () => {
    console.log('si entra')
    return (dispatch, getState) => {
        console.log('inside return')
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(position)
                dispatch({
                    type: Types.FETCH_LOCATION,
                    location: position.coords
                });
            },
            // {enableHighAccuracy: true, timeout: 1000, maximumAge: 0, distanceFilter: 1, }
        )
    }
}

const fetchLocation = (state = ININTIAL_STATE, action) => {
    let {location} = action;
    console.log(location)
    return { ...state, location }
}

export default createReducer(ININTIAL_STATE, {
    [Types.FETCH_LOCATION]: fetchLocation,
})