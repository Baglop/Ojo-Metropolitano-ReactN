import { createActions, createReducer } from "reduxsauce";
import { getStore } from "../store";
import PouchDB from 'pouchdb-react-native';
const db = new PouchDB('OjoMetropolitano');

export const { Types, Creators } = createActions({
    fetchLocation: ['location']
})

const ININTIAL_STATE = {
    location: false
}

export const getLocation = () => {
    return (dispatch) => {
        navigator.geolocation.watchPosition(
            (position) => {
                dispatch({
                    type: Types.FETCH_LOCATION,
                    location: position.coords
                });
            },
            {enableHighAccuracy: true, timeout: 1000, maximumAge: 0, distanceFilter: 1, }
        )
    }
}

const fetchLocation = (state = ININTIAL_STATE, action) => {
    let {location} = action;
    return { ...state, location }
}

export default createReducer(ININTIAL_STATE, {
    [Types.FETCH_LOCATION]: fetchLocation,
})