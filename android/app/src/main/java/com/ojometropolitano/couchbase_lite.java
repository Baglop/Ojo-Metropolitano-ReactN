package com.ojometropolitano;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import com.couchbase.lite.Database;
import com.couchbase.lite.MutableDocument;
import com.couchbase.lite.Query;
import com.couchbase.lite.QueryBuilder;
import com.couchbase.lite.CouchbaseLiteException;
import com.couchbase.lite.DataSource;
import com.couchbase.lite.SelectResult;
import com.couchbase.lite.ResultSet;
import com.couchbase.lite.Expression;
import com.couchbase.lite.Result;
import com.couchbase.lite.Meta;

import java.util.List;
/**
 * Created by inzod on 22/01/2019.
 */

public class couchbase_lite extends ReactContextBaseJavaModule {
     private Database database;
    private String DOC_TYPE = "userData";

    couchbase_lite(ReactApplicationContext reactContext){
        super(reactContext);
        DatabaseManager.getSharedInstance(reactContext);
        this.database = DatabaseManager.getDatabase();
    }

    @Override
    public String getName() {
        return  "couchbase_lite";
    }

    @ReactMethod
    private void userDataDocExist(Callback error, Callback succes){
        Query query = QueryBuilder
        .select(
            SelectResult.expression(Meta.id)
        )
        .from(DataSource.database(database))
        .where(
            Expression.property("type")
            .equalTo(Expression.string(DOC_TYPE))
        );

        try {
            ResultSet resultSet = query.execute();
            List<Result> list = resultSet.allResults();

            if (list.isEmpty()) {
                error.invoke(false);
            } else {
                succes.invoke(true);
            }
        } catch (CouchbaseLiteException e) {
            e.printStackTrace();
            error.invoke(false);
        }
    }

    @ReactMethod
    private void setUserdataDoc(){
        try {
            MutableDocument mutableDocument = new MutableDocument()
                .setString("type", DOC_TYPE)
                .setString("userName", "Test")
                .setString("password","123");
            database.save(mutableDocument);
        } catch (CouchbaseLiteException e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    private void deleteUserdataDoc(Callback err, Callback succ) {
        Query query = QueryBuilder
            .select(
                SelectResult.expression(Meta.id)
            )
            .from(DataSource.database(database))
            .where(
                Expression.property("type")
                .equalTo(Expression.string(DOC_TYPE))
            );

        try {
            ResultSet resultSet = query.execute();
            List<Result> list = resultSet.allResults();

            if (list.isEmpty()) {
                err.invoke("No hay documentos");
            } else {
                Result result = list.get(0);
                String documentId = result.getString("id");
                database.delete(database.getDocument(documentId));
                succ.invoke("Documentos eliminados");
            }
        } catch (CouchbaseLiteException e) {
            e.printStackTrace();
            err.invoke("Error");
        }
    }
}
