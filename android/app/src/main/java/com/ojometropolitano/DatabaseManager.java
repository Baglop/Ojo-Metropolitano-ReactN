package com.ojometropolitano;


import android.content.Context;

import com.couchbase.lite.CouchbaseLiteException;
import com.couchbase.lite.Database;
import com.couchbase.lite.DatabaseConfiguration;

public class DatabaseManager {

    private static String DB_NAME = "usuario";

    private static Database database;
    private static DatabaseManager instance = null;
    //Crea o abre base de datos
    private DatabaseManager(Context context) {
        DatabaseConfiguration configuration = new DatabaseConfiguration(context);
        try {
            database = new Database(DB_NAME, configuration);
        } catch (CouchbaseLiteException e) {
            e.printStackTrace();
        }
        
    }

    public static DatabaseManager getSharedInstance(Context context) {
        if (instance == null) {
            instance = new DatabaseManager(context);
        }
        return instance;
    }

    public static Database getDatabase() {
        if (instance == null) {
            try {
                throw new Exception("Must call getSharedInstance first");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return database;
    }

}