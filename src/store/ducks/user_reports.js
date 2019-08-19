import { createActions, createReducer } from "reduxsauce";
import { getStore } from "../store";
import PouchDB from 'pouchdb-react-native';
const db = new PouchDB('OjoMetropolitano');
import endpoint from '../Server/endpoint.json';
import { PouchDB_Insert } from '../Database/PouchDBQuerys';

export const { Types, Creators } = createActions({
    fetchUserReports: ['reports']
})

const ININTIAL_STATE = {
    reports: false
}

export const getUserReports = (bodyFetch) => {
    return (dispatch) => {
        fetch(`${endpoint.URL + endpoint.userReports}`, {
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
                            responseJSON.reportes.map((data) => {
                                PouchDB_Insert(data._id, 'userReports', data)
                            })
                        } else {
                            console.log('no se pudo we update')
                        }
                    })
            })
        // dispatch({
        //     type: Types.FETCH_USER_REPORTS,
        //     user: false
        // });
    }
}

const fetchUserReports = (state = ININTIAL_STATE, action) => {
    let { reports } = action;
    return { ...state, reports }
}

export default createReducer(ININTIAL_STATE, {
    [Types.FETCH_USER_REPORTS]: fetchUserReports,
})