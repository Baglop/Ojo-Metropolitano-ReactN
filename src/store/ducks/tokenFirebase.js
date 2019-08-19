import { createActions, createReducer } from "reduxsauce";
import { getStore } from "../store";
import PouchDB from 'pouchdb-react-native';
const db = new PouchDB('OjoMetropolitano');
import firebase from 'react-native-firebase';

export const { Types, Creators } = createActions({
    fetchToken: ['token']
})

const ININTIAL_STATE = {
    token: false
}

export const getToken = () => {
    return (dispatch, getState) => {
        firebase.messaging().getToken()
            .then(fcmToken => {
                if (fcmToken) {
                    console.log(fcmToken)
                    dispatch({
                        type: Types.FETCH_TOKEN,
                        token: fcmToken
                    });
                } else {
                    console.log("No hay token")
                }
            });
    }
}

const fetchToken = (state = ININTIAL_STATE, action) => {
    let { token } = action
    return { ...state, token }
}

export default createReducer(ININTIAL_STATE, {
    [Types.FETCH_TOKEN]: fetchToken,
})