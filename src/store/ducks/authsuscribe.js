import { createActions, createReducer } from "reduxsauce";
import { getStore } from "../store";
import { Alert } from "react-native";
import PouchDB from 'pouchdb-react-native';
import { PouchDB_DeleteDB } from '../Database/PouchDBQuerys';
const db = new PouchDB('OjoMetropolitano');
import endpoint from '../Server/endpoint.json';
import { updateUser } from './update_user';
import { getUserReports } from './user_reports';
import { getUserFriends } from './user_friends';

export const { Types, Creators } = createActions({
    fetchUser: ['user'],
    fetchLogout: ['user'],
})

const ININTIAL_STATE = {
    user: 'loading',
    userInfo: null
}

export const getUser = () => {
    return (dispatch) => {
        // db.allDocs({
        //     include_docs: true,
        //     attachments: true
        // }).then(function (result) {
        //     console.log(result.rows);
        // dispatch({
        //     type: Types.FETCH_USER,
        //     user: 'ready'
        // });

        db.get('Body').then(doc => {
            dispatch({
                type: Types.FETCH_USER,
                user: 'ready',
                userInfo: doc
            });
        }).catch(err => {
            console.log(err);
            dispatch({
                type: Types.FETCH_USER,
                user: 'logout'
            });
        });
    }
}

export const signin = (body, token) => {
    return (dispatch, getState) => {
        fetch(`${endpoint.URL + endpoint.login}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                response.json()
                    .then(responseJSON => {
                        if (responseJSON.codigoRespuesta === 200) {
                            const bodyFetch = {
                                nombreUsuario: body.nombreUsuario,
                                atributoModificado: "tokenFirebase",
                                valorNuevo: token,
                                tokenSiliconBear: responseJSON.tokenSiliconBear,
                                ubicacionUsuario: body.ubicacionUsuario
                            }
                            const bodyPeticion = {
                                nombreUsuario: body.nombreUsuario,
                                tokenSiliconBear: responseJSON.tokenSiliconBear,
                                ubicacionUsuario: body.ubicacionUsuario
                            }
                            dispatch(updateUser(bodyFetch));
                            dispatch(getUserReports(bodyPeticion));
                            dispatch(getUserFriends(bodyPeticion));
                            dispatch({
                                type: Types.FETCH_USER,
                                user: 'ready'
                            });
                        } else {
                            console.log(responseJSON)
                            Alert.alert(
                                'Error',
                                responseJSON.mensaje,
                                [,
                                    { text: 'Aceptar' }
                                ],
                            );
                        }
                    })
            })
    }
}

export const logout = (dispatch) => {
    PouchDB_DeleteDB();
    let store = getStore();
    store.dispatch({
        type: Types.FETCH_LOGOUT,
        user: 'logout'
    });
}

const fetchLogout = (state = ININTIAL_STATE, action) => {
    let { user } = action;
    return { ...state, user }
}

const fetchUser = (state = ININTIAL_STATE, action) => {
    let { user, userInfo } = action;
    return { ...state, user, userInfo }
}

export default createReducer(ININTIAL_STATE, {
    [Types.FETCH_USER]: fetchUser,
    [Types.FETCH_LOGOUT]: fetchLogout
})