package com.ojometropolitano;

import android.util.Log;

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
    private String USER_REPORTS_DOC= "userReports";
    private String USER_INFO = "userInfo";

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
    private void getUserInfoDoc(Callback error, Callback success){
        Query query = QueryBuilder
        .select(
            SelectResult.expression(Meta.id),
            SelectResult.property("nombreUsuario"),
            SelectResult.property("nombres"),
            SelectResult.property("apellidoPaterno"),
            SelectResult.property("apellidoMaterno"),
            SelectResult.property("correo"),
            SelectResult.property("celular"),
            SelectResult.property("tokenFirebase"),
            SelectResult.property("imagenPerfil")
        )
        .from(DataSource.database(database))
        .where(
            Expression.property("type")
            .equalTo(Expression.string(USER_INFO))
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
    private void getUserReportsDoc(Callback error, Callback success){
        Query query = QueryBuilder
        .select(
            SelectResult.expression(Meta.id),
            SelectResult.property("_id"),
            SelectResult.property("autorReporte"),
            SelectResult.property("tipoReporte"),
            SelectResult.property("descripcion"),
            SelectResult.property("evidencia"),
            SelectResult.property("fechaIncidente"),
            SelectResult.property("latitud"),
            SelectResult.property("longitud"),
            SelectResult.property("fechaReporte"),
            SelectResult.property("ubicacionUsuario")
        )
        .from(DataSource.database(database))
        .where(
            Expression.property("type")
            .equalTo(Expression.string(USER_REPORTS_DOC))
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
    private void setUserInfoDoc(String userInfoString){
        try {
            JSONObject response = new JSONObject(userInfoString);
            JSONObject userInfoReponse = response.getJSONObject("usuario");
            MutableDocument mutableDocument = new MutableDocument()
                .setString("type", USER_INFO)
                .setString("nombreUsuario", userInfoReponse.getString("nombreUsuario"))
                .setString("nombres",userInfoReponse.getString("nombres"))
                .setString("apellidoPaterno",userInfoReponse.getString("apellidoPaterno"))
                .setString("apellidoMaterno",userInfoReponse.getString("apellidoMaterno"))
                .setString("correo",userInfoReponse.getString("correo"))
                .setString("celular",userInfoReponse.getString("celular"))
                .setString("tokenFirebase",userInfoReponse.getString("tokenFirebase"))
                .setString("imagenPerfil",userInfoReponse.getString("imagenPerfil"));
            database.save(mutableDocument);
        } catch (CouchbaseLiteException | JSONException e ) {
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
    private void deleteUserInfoDoc(Callback err, Callback succ) {
        Query query = QueryBuilder
            .select(
                SelectResult.expression(Meta.id)
            )
            .from(DataSource.database(database))
            .where(
                Expression.property("type")
                .equalTo(Expression.string(USER_INFO))
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
    private void deleteUserReportsDoc(Callback err, Callback succ) {
        Query query = QueryBuilder
                .select(
                        SelectResult.expression(Meta.id)
                )
                .from(DataSource.database(database))
                .where(
                        Expression.property("type")
                                .equalTo(Expression.string(USER_REPORTS_DOC))
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
    private void setReportDataDoc(String reportDataResponse, int docType){
        String DOC_NAME = "";
        if(docType == 1)
            DOC_NAME = REPORTS_DOC;
        else if(docType == 2)
            DOC_NAME = USER_REPORTS_DOC;

        Query query = QueryBuilder
        .select(
            SelectResult.expression(Meta.id)
        )
        .from(DataSource.database(database))
        .where(
            Expression.property("type")
            .equalTo(Expression.string(DOC_NAME))
        );
        try {
            ResultSet resultSet = query.execute();
            List<Result> list = resultSet.allResults();
            JSONObject JHONSON = new JSONObject(reportDataResponse);
            JSONArray JHONSONArr = JHONSON.getJSONArray("reportes");
            if(!list.isEmpty()){
                for(Result result : resultSet){
                    String documentId = result.getString("id");
                    database.delete(database.getDocument(documentId));
                }
                
                if(docType == 1) {
                    for (int i = 0; i < JHONSONArr.length(); i++) {
                        JSONObject JHONSONObject = JHONSONArr.getJSONObject(i);
                        createReportDoc(JHONSONObject);
                    }
                    Log.d("AVISO","Si entro y debio guardar en base de datos alv 248");
                }
                else if(docType == 2){
                    for (int i = 0; i < JHONSONArr.length(); i++) {
                        JSONObject JHONSONObject = JHONSONArr.getJSONObject(i);
                        createUserReportDoc(JHONSONObject);
                    }
                    Log.d("AVISO","Si entro y debio guardar en base de datos alv 255");
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

    void createUserReportDoc(JSONObject JHONSON){
        try{
        MutableDocument mutableDocument = new MutableDocument()
            .setString("type", USER_REPORTS_DOC)
            .setString("_id", JHONSON.getString("_id"))
            .setString("autorReporte", JHONSON.getString("autorReporte"))
            .setString("tipoReporte", JHONSON.getString("tipoReporte"))
            .setString("descripcion", JHONSON.getString("descripcion"))
            .setString("evidencia", JHONSON.getString("evidencia"))
            .setString("fechaIncidente", JHONSON.getString("fechaIncidente"))
            .setDouble("latitud",JHONSON.getDouble("latitud"))
            .setDouble("longitud", JHONSON.getDouble("longitud"))
            .setString("fechaReporte",JHONSON.getString("fechaReporte"))
            .setString("ubicacionUsuario", JHONSON.getString("ubicacionUsuario"));
        database.save(mutableDocument);
        } catch(CouchbaseLiteException | JSONException e){
            e.printStackTrace();
        }
    }
}
