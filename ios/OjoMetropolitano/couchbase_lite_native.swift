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
  
  @objc func userDataDocExistTXT(_ errorCallback: @escaping () -> Void, _ successCallback: @escaping () -> Void) {
    let query = QueryBuilder
      .select(SelectResult.expression(Meta.id))
      .from(DataSource.database(database))
      .where(Expression.property("type")
      .equalTo(Expression.string(USER_DOC)));
    do{
      let resulSet = try query.execute()
      let array = resulSet.allResults()
      if (array.count == 0){
        errorCallback();
      } else {
        successCallback();
      }
    } catch {
      print(error)
      errorCallback();
    }
  }
  
  
  @objc func setUserdataDocTXT(_ userDataResponse : String, _ userName : String)
  {
    do {
      let mutableDocument = MutableDocument()
      .setString("type", forKey: USER_DOC)
      .setString("userName", forKey: userName)
      .setString("tokenSiliconBear", forKey: userDataResponse)
      try database.saveDocument(mutableDocument);
      print("Se guardo el documentos en couchbase")
    } catch {
      fatalError(error.localizedDescription)
    }
  }
  
  @objc func deleteUserDataDoc(_ errorCallback: @escaping () -> Void, _ successCallback: @escaping () -> Void) {
    let query = QueryBuilder
    .select(SelectResult.expression(Meta.id))
    .from(DataSource.database(database))
    .where(Expression.property("type")
    .equalTo(Expression.string(USER_DOC)))
    
    do {
      let resulSet = try query.execute()
      let array = resulSet.allResults()
      if (array.count == 0){
        errorCallback()
      } else {
        let documentID = array[0].string(forKey: "id")!
        let document = database.document(withID: documentID)!
        try database.deleteDocument(document)
        successCallback()
      }
    } catch {
      errorCallback();
      fatalError(error.localizedDescription)
    }
  }
}
