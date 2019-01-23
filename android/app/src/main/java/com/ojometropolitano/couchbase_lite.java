package com.ojometropolitano;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

/**
 * Created by inzod on 22/01/2019.
 */

public class couchbase_lite extends ReactContextBaseJavaModule {
    couchbase_lite(ReactApplicationContext reactContext){
        super(reactContext);
    }

    @Override
    public String getName() {
        return  "couchbase_lite";
    }
}
