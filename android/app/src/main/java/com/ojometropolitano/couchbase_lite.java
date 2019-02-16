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
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;
import java.util.List;
/**
 * Created by inzod on 22/01/2019.
 */

public class couchbase_lite extends ReactContextBaseJavaModule {
     private Database database;
    private String USER_DOC = "userData";
    private String REPORTS_DOC = "reportData";

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
    private void userDataDocExist(Callback error, Callback success){
        Query query = QueryBuilder
        .select(
            SelectResult.expression(Meta.id)
        )
        .from(DataSource.database(database))
        .where(
            Expression.property("type")
            .equalTo(Expression.string(USER_DOC))
        );

        try {
            ResultSet resultSet = query.execute();
            List<Result> list = resultSet.allResults();

            if (list.isEmpty()) {
                error.invoke(false);
            } else {
                success.invoke(true);
            }
        } catch (CouchbaseLiteException e) {
            e.printStackTrace();
            error.invoke(false);
        }
    }

    @ReactMethod
    private void getUserdataDoc(Callback error, Callback success){
        Query query = QueryBuilder
        .select(
            SelectResult.expression(Meta.id),
            SelectResult.property("userName"),
            SelectResult.property("tokenSiliconBear")
        )
        .from(DataSource.database(database))
        .where(
            Expression.property("type")
            .equalTo(Expression.string(USER_DOC))
        );

        try {
            ResultSet resultSet = query.execute();
            WritableArray writableArray = Arguments.createArray();
            assert resultSet != null;
            for (Result result : resultSet) {
                WritableMap writableMap = Arguments.makeNativeMap(result.toMap());
                writableArray.pushMap(writableMap);
            }
            success.invoke(writableArray);
        } catch (CouchbaseLiteException e) {
            e.printStackTrace();
            error.invoke();
        }
    }

    @ReactMethod
    private void setUserdataDoc(String userDataResponse, String userName){
        try {
            MutableDocument mutableDocument = new MutableDocument()
                .setString("type", USER_DOC)
                .setString("userName", userName)
                .setString("tokenSiliconBear",userDataResponse);
            database.save(mutableDocument);
        } catch (CouchbaseLiteException e ) {
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
                .equalTo(Expression.string(USER_DOC))
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
                succ.invoke("Documento eliminado");
            }
        } catch (CouchbaseLiteException e) {
            e.printStackTrace();
            err.invoke("Error");
        }
    }

    @ReactMethod
    private void setReportDataDoc(String reportDataResponse){
        Query query = QueryBuilder
        .select(
            SelectResult.expression(Meta.id)
        )
        .from(DataSource.database(database))
        .where(
            Expression.property("type")
            .equalTo(Expression.string(REPORTS_DOC))
        );
        try {
            ResultSet resultSet = query.execute();
            List<Result> list = resultSet.allResults();
            JSONObject JHONSON = new JSONObject(reportDataResponse);
            JSONArray JHONSONArr = JHONSON.getJSONArray("reportes");
            if(!list.isEmpty())
            {
                for(Result result : resultSet)
                {
                    String documentId = result.getString("id");
                    database.delete(database.getDocument(documentId));
                }

                for(int i = 0; i < JHONSONArr.length(); i++){
                    JSONObject JHONSONObject = JHONSONArr.getJSONObject(i);
                    createReportDoc(JHONSONObject);
                }
            }
        } catch (CouchbaseLiteException | JSONException e ) {
            e.printStackTrace();
        }
    }

    void createReportDoc(JSONObject JHONSON){
        try{
        MutableDocument mutableDocument = new MutableDocument()
            .setString("type", REPORTS_DOC)
            .setString("id", JHONSON.getString("id"))
            .setString("tipo", JHONSON.getString("tipo"))
            .setDouble("latitude",JHONSON.getDouble("latitud"))
            .setDouble("longitude", JHONSON.getDouble("longitud"))
            .setString("fechaIncidente", JHONSON.getString("fechaIncidente"));
        database.save(mutableDocument);
        } catch(CouchbaseLiteException | JSONException e){
            e.printStackTrace();
        }
    }
}
