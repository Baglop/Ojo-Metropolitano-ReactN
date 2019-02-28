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

struct ReportsGlobal: Decodable {
  let codigoRespuesta: Int
  let mensaje:         String
  let reportes:        [Reportes]
}

struct Reportes : Decodable {
  let id:             String
  let tipo:           String
  let latitud:       String
  let longitud:      String
  let fechaIncidente: String
}

@objc (couchbase_lite_native)
class couchbase_lite_native : NSObject
{
  let database         = DatabaseManager.sharedInstance().database
  let USER_DOC         = "userData"
  let REPORTS_DOC      = "reportData"
  let USER_REPORTS_DOC = "userReports"
  
  @objc func userDataDocExistTXT(_ errorCallback: @escaping (Bool) -> Void, _ successCallback: @escaping (String) -> Void)
  {
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
  
  @objc func getUserdataDocTXT(_ errorCallback: @escaping (Bool) -> Void, _ successCallback: @escaping ([[[AnyHashable : Any ]]]) -> Void)
  {
      let query = QueryBuilder
      .select(
        SelectResult.expression(Meta.id),
        SelectResult.expression(Expression.property("userName")),
        SelectResult.expression(Expression.property("tokenSiliconBear"))
      )
      .from(DataSource.database(self.database))
      .where(Expression.property("type")
      .equalTo(Expression.string(USER_DOC)));
    
    do{
      let resulSet = try query.execute()
      var array: [[AnyHashable : Any]] = []
      for result in resulSet {
        let map = result.toDictionary()
        print("10______***************************************************")
        print(result.toDictionary())
        print("11______***************************************************")
        array.append(map)
      }
      successCallback([array])
    } catch {
      print(error)
      errorCallback(false)
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
  
  @objc func deleteUserDataDocTXT(_ errorCallback: @escaping (String) -> Void, _ successCallback: @escaping (String) -> Void)
  {
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
  
  @objc func setReportDataDocTXT(_ reportDataResponse : String, _ docType : Int)
  {
    var DOC_NAME = ""
    if(docType == 1) {
      DOC_NAME = REPORTS_DOC
    }
    else if (docType == 2) {
      DOC_NAME = USER_REPORTS_DOC
    }
    let data = reportDataResponse.data(using: .utf8)
    let query = QueryBuilder
      .select(SelectResult.expression(Meta.id))
      .from(DataSource.database(self.database))
      .where(Expression.property("type")
      .equalTo(Expression.string(REPORTS_DOC)));
    do{
      let resulSet = try query.execute()
      let array = resulSet.allResults()
      let reportsGlobal = try JSONDecoder().decode(ReportsGlobal.self, from: data!)
      print("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
      print(reportsGlobal.reportes)
      print("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
      if (array.count == 0){
        for resultados in resulSet{
          let documentID = resultados.string(forKey: "id")!
          let document = database.document(withID: documentID)!
          try database.purgeDocument(document)
        }
      }
    } catch {
      print(error)
    }
  }

}
