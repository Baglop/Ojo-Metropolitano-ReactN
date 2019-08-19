import { createActions, createReducer } from "reduxsauce";
import { getStore } from "../store";
import PouchDB from 'pouchdb-react-native';
const db = new PouchDB('OjoMetropolitano');
import { AsyncStorage } from 'react-native';

export const { Types, Creators } = createActions({
    fetchUser: ['user']
})

const ININTIAL_STATE = {
    user: false
}

export const getUser = () => {
    return (dispatch) => {
        db.allDocs({
            include_docs: true,
            attachments: true
        }).then(function (result) {
            console.log(result.rows);
            dispatch({
                type: Types.FETCH_USER,
                user: true
            });
        }).catch(function (err) {
            console.log(err);
        });
    }
}

const fetchUser = (state = ININTIAL_STATE, action) => {
    let { user } = action;
    return { ...state, user }
}

export default createReducer(ININTIAL_STATE, {
    [Types.FETCH_USER]: fetchUser,
})