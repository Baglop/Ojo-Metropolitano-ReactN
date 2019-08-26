import { createActions, createReducer } from "reduxsauce";
import { getStore } from "../store";
import PouchDB from 'pouchdb-react-native';
const db = new PouchDB('OjoMetropolitano');
import endpoint from '../Server/endpoint.json';

export const { Types, Creators } = createActions({
    fetchGlobalReports: ['global_reports']
})

const ININTIAL_STATE = {
    global_reports: false
}

export const getGlobalReports = (body) => {
    return (dispatch) => {
        fetch(`${endpoint.URL + endpoint.globalReports}`, {
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
                        console.log(responseJSON)
                        if (responseJSON.codigoRespuesta === 200) {
                            
                            dispatch({
                                type: Types.FETCH_GLOBAL_REPORTS,
                                global_reports: responseJSON.reportes
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

const fetchGlobalReports = (state = ININTIAL_STATE, action) => {
    let { global_reports } = action;
    return { ...state, global_reports }
}

export default createReducer(ININTIAL_STATE, {
    [Types.FETCH_GLOBAL_REPORTS]: fetchGlobalReports,
})