import { createActions, createReducer } from "reduxsauce";
import { getStore } from "../store";
import PouchDB from 'pouchdb-react-native';
const db = new PouchDB('OjoMetropolitano');
import endpoint from '../Server/endpoint.json';
import { PouchDB_Insert } from '../Database/PouchDBQuerys';

export const { Types, Creators } = createActions({
    fetchUser: ['user']
})

const ININTIAL_STATE = {
    user: false
}

export const updateUser = (bodyFetch) => {
    return (dispatch, getState) => {
        fetch(`${endpoint.URL + endpoint.updateUser}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(bodyFetch)
        })
            .then(response => {
                response.json()
                    .then(responseJSON => {
                        if (responseJSON.codigoRespuesta === 200) {
                            console.log(responseJSON)
                            PouchDB_Insert('UserData', 'UserData', responseJSON.usuario)
                            PouchDB_Insert('Body', 'Body', bodyFetch)                      
                            
                        } else {
                            console.log('no se pudo we update')
                        }
                    })
            })
        // dispatch({
        //     type: Types.FETCH_USER,
        //     user: false
        // });
    }
}

const fetchUser = (state = ININTIAL_STATE, action) => {
    let { user } = action;
    return { ...state, user }
}

export default createReducer(ININTIAL_STATE, {
    [Types.FETCH_USER]: fetchUser,
})