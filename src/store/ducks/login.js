import { createActions, createReducer } from "reduxsauce";
import { getStore } from "../store";
import PouchDB from 'pouchdb-react-native';
const db = new PouchDB('OjoMetropolitano');
import endpoint from '../Server/endpoint.json';
import { updateUser } from './update_user';
import { getUserReports } from './user_reports';
import {getUserFriends} from './user_friends'

export const { Types, Creators } = createActions({
    fetchLogin: ['user']
})

const ININTIAL_STATE = {
    user: false
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
                            console.log(responseJSON)

                        } else {
                            console.log('no se pudo we login')
                        }
                    })
            })
    }
}

const fetchLogin = (state = ININTIAL_STATE, action) => {
    let { user } = action;
    return { ...state, user }
}

export default createReducer(ININTIAL_STATE, {
    [Types.FETCH_LOGIN]: fetchLogin,
})