//
//  couchbase_lite.swift
//  OjoMetropolitano
//
//  Created by Jesus Reynaga Rodriguez on 27/01/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import Foundation

import CouchbaseLiteSwift


@objc (couchbase_lite_native)
class couchbase_lite_native : NSObject
{
  let database = DatabaseManager.sharedInstance().database
  let USER_DOC = "userData"
  
  @objc func userDataDocExistTXT(_ errorCallback: @escaping (Bool) -> Void, _ successCallback: @escaping (String) -> Void) {
    
    let query = QueryBuilder
      .select(SelectResult.expression(Meta.id))
      .from(DataSource.database(self.database))
      .where(Expression.property("type")
        .equalTo(Expression.string(USER_DOC)));
    do {
      let resulSet = try query.execute()
      let array = resulSet.allResults()
      
      if (array.count == 0){
        print("10______***************************************************")
        print("No hay documentos")
        errorCallback(false)
      }
      else {
        let documentID = array[0].string(forKey: "id")!
        let document = database.document(withID: documentID)!
        print("10______***************************************************")
        print(document.toDictionary())
        print("11______***************************************************")
        successCallback("Si encontró documento")
      }
    } catch {
      errorCallback(false);
      fatalError(error.localizedDescription)
    }
  }
  
  @objc func setUserdataDocTXT(_ userDataResponse : String, _ userName : String)
  {
    do {
      let mutableDocument = MutableDocument()
      .setString(USER_DOC, forKey: "type")
      .setString(userName, forKey: "userName")
      .setString(userDataResponse, forKey: "tokenSiliconBear")
      try database.saveDocument(mutableDocument);
      print("******************************************************************************************************")
      print("Se guardo el documentos en couchbase")
      print(mutableDocument.toDictionary())
      print("******************************************************************************************************")
    } catch {
      fatalError(error.localizedDescription)
    }
  }
  
  @objc func deleteUserDataDocTXT(_ errorCallback: @escaping (String) -> Void, _ successCallback: @escaping (String) -> Void) {
    let query = QueryBuilder
      .select(SelectResult.expression(Meta.id))
      .from(DataSource.database(self.database))
      .where(Expression.property("type")
        .equalTo(Expression.string(USER_DOC)));
    do {
      let resulSet = try query.execute()
      let array = resulSet.allResults()
      
      if (array.count == 0){
        print("9______***************************************************")
        print("No hay documentos")
        errorCallback("No hay documento")
      }
      else {
        let documentID = array[0].string(forKey: "id")!
        let document = database.document(withID: documentID)!
        try database.purgeDocument(document)
        print("10______***************************************************")
        print(document.toDictionary())
        print("11______***************************************************")
        successCallback("Documento eliminado")
      }
    } catch {
      errorCallback("No se pudo revisar");
      fatalError(error.localizedDescription)
    }
  }
  
  func findOrCreateBookmarkDocument() -> MutableDocument {
    let query = QueryBuilder
      .select(
        SelectResult.expression(Meta.id))
      .from(DataSource.database(database))
      .where(
        Expression.property("type")
          .equalTo(Expression.string(USER_DOC)))
    
    do {
      let resultSet = try query.execute()
      let array = resultSet.allResults()
      if (array.count == 0) {
        let mutableDocument = MutableDocument()
          .setString(USER_DOC, forKey: "type")
        try database.saveDocument(mutableDocument)
        return mutableDocument
      } else {
        let documentId = array[0].string(forKey: "id")!
        let document = database.document(withID: documentId)!
        return document.toMutable()
      }
    } catch {
      fatalError(error.localizedDescription);
    }
  }
}
