import PouchDB from 'pouchdb-react-native'; 
import PouchdbFind from 'pouchdb-find';
import {Alert} from 'react-native';
import _ from 'lodash';
const db = new PouchDB('OjoMetropolitano');

async function PouchDB_Insert(_id, type, params){
  db.put({
    _id: _id,
    type: type,
    ...params
  }).then(function (response) {
    console.log("Ya se almaceno localmente", response);
  }).catch(function (err) {
    console.log("Error al insertar", err);
    Alert.alert(
      'Error',
      'Error al intentar almacenar los datos, por favor intenta de nuevo.',
      [,
          {text: 'OK'},
      ],
          {cancelable: false},
      );
  });
}

async function PouchDB_Get_Document(_id){
  try {
    var doc = await db.get(_id);
    return doc
  } catch (err) {
    console.log(err);
  }
}

async function PouchDB_DeleteDB(){
  db.destroy().then(function (response) {
    console.log("Exito se ha borrado la base de datos", response);
  }).catch(function (err) {
    console.log("Ya se borro la DB", err);
    Alert.alert(
      'Error',
      'Error al intentar eliminar, por favor intenta de nuevo.',
      [,
          {text: 'OK'},
      ],
          {cancelable: false},
      );
  });
}

async function PouchDB_UpdateDoc(_id, type, params){
  db.get(_id).then(function(doc) {
    return db.put({
      _id: _id,
      _rev: doc._rev,
      type: type,
      ...params
    });
  }).then(function(response) {
    console.log("si se actualizo", response);
  }).catch(function (err) {
    console.log(err);
  });
}

async function PouchDB_DeleteDoc(_id){
db.get(_id).then(function(doc) {
  return db.remove(doc._id, doc._rev);
}).then(function (result) {
  console.log("Si se borro el documento", result);
}).catch(function (err) {
  console.log(err);
});
}

export { PouchDB_Insert }
export { PouchDB_DeleteDB }
export { PouchDB_Get_Document }
export { PouchDB_UpdateDoc }
export { PouchDB_DeleteDoc }