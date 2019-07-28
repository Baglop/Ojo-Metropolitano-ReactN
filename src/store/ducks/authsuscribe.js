import { createActions, createReducer } from "reduxsauce";
import { getStore } from "../store";
import PouchDB from 'pouchdb-react-native';
const db = new PouchDB('OjoMetropolitano');

export const { Types, Creators } = createActions({
    fetchUser: ['user']
})

const ININTIAL_STATE = {
    user: false
}

export const getUser = (dispatch) => {
    return (dispatch) => {
        let store = getStore();
        store.dispatch({
            type: Types.FETCH_USER,
            user: true
        });
    }

    // db.get('BasicValues').then(doc => {
    //     console.log(doc)
    //     store.dispatch({
    //         type: Types.FETCH_USER,
    //         user: true
    //     });
    // });
}

const fetchUser = (state = ININTIAL_STATE, action) => {
    let user = action;
    return { ...state, user }
}

export default createReducer(ININTIAL_STATE, {
    [Types.FETCH_USER]: fetchUser,
})