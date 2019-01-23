package com.ojometropolitano;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


/**
 * Created by inzod on 22/01/2019.
 */

public class couchbase_lite_package implements ReactPackage {

    @Override
    public List<com.facebook.react.uimanager.ViewManager>
    createViewManagers(ReactApplicationContext reactContext){
       return Collections.emptyList();
   }

   @Override
    public List<NativeModule>
    createNativeModules(ReactApplicationContext reactContext){
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new couchbase_lite(reactContext));
        return modules;
   }

}