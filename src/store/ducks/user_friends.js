import { createActions, createReducer } from "reduxsauce";
import { getStore } from "../store";
import PouchDB from 'pouchdb-react-native';
const db = new PouchDB('OjoMetropolitano');
import endpoint from '../Server/endpoint.json';
import _ from 'lodash';
import { PouchDB_Insert } from '../Database/PouchDBQuerys';

export const { Types, Creators } = createActions({
    fetchUserFriends: ['friends']
})

const ININTIAL_STATE = {
    friends: false
}

export const getUserFriends = (bodyFetch) => {
    return (dispatch) => {
        fetch(`${endpoint.URL + endpoint.userFriends}`, {
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
                            if (_.size(responseJSON.amigos) > 0) {
                                responseJSON.amigos.map((data) => {
                                    PouchDB_Insert(data._id, 'friends', data)
                                })
                            }
                            if (_.size(responseJSON.grupos) > 0) {
                                responseJSON.grupos.map((data) => {
                                    PouchDB_Insert(data.idGrupo, 'groups', data)
                                })
                            }
                        } else {
                            console.log('no se pudo we update')
                        }
                    })
            })
        // dispatch({
        //     type: Types.FETCH_USER_FRIENDS,
        //     user: false
        // });
    }
}

const fetchUserFriends = (state = ININTIAL_STATE, action) => {
    let { friends } = action;
    return { ...state, friends }
}

export default createReducer(ININTIAL_STATE, {
    [Types.FETCH_USER_FRIENDS]: fetchUserFriends,
})