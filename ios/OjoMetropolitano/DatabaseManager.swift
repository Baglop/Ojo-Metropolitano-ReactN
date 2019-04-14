//
//  DatabaseManager.swift
//  OjoMetropolitano
//
//  Created by Jesus Reynaga Rodriguez on 30/01/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

//import Foundation
//import CouchbaseLiteSwift
//
//class DatabaseManager
//{
//  private static var privateSharedInstance: DatabaseManager?
//  
//  var database: Database
//  
//  let DB_NAME = "usuario"
//  
//  class func sharedInstance() -> DatabaseManager   {
//    guard let privateInstance = DatabaseManager.privateSharedInstance else {
//      DatabaseManager.privateSharedInstance = DatabaseManager()
//      return DatabaseManager.privateSharedInstance!
//    }
//    return privateInstance
//  }
//  
//  private init() {
//    do {
//      self.database = try Database(name: self.DB_NAME)
//    } catch {
//      fatalError("Could not copy database")
//    }
//  }
//}
