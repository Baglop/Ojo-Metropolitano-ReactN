import { createActions, createReducer } from "reduxsauce";
import { getStore } from "../store";
import Permissions from 'react-native-permissions';
import OpenAppSettings from 'react-native-app-settings';
import { Alert } from 'react-native'

export const { Types, Creators } = createActions({
    fetchLocationPermission: ['locationPermission']
})

const ININTIAL_STATE = {
    locationPermission: null
}

export const checkLocationPermission = () => {
    return (dispatch, getState) => {
        Permissions.request('location', {}).then(response => {
            dispatch({
                type: Types.FETCH_LOCATION_PERMISSION,
                locationPermission: response.location
            })
        });
    }
}

export const requestLocationPermission = () => {
    return (dispatch, getState) => {
        Permissions.checkMultiple(['location']).then(response => {
            if (response.location === 'undetermined') {
                dispatch(checkLocationPermission())
            } else if (response.location === 'denied' || response.location === 'restricted') {
                Alert.alert(
                    'Ubicación Requerida',
                    'Para poder continuar se requiere de tu ubicación.',
                    [,
                        { text: 'Configuración', onPress: () => OpenAppSettings.open() },
                    ],
                );
            }
            dispatch({
                type: Types.FETCH_LOCATION_PERMISSION,
                locationPermission: response.location
            })
        });
    }
}

const fetchLocationPermission = (state = ININTIAL_STATE, action) => {
    let { locationPermission } = action;
    return { ...state, locationPermission }
}

export default createReducer(ININTIAL_STATE, {
    [Types.FETCH_LOCATION_PERMISSION]: fetchLocationPermission,
})