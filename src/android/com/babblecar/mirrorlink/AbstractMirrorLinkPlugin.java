package com.babblecar.mirrorlink;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.os.Bundle;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;
import com.mirrorlink.android.commonapi.ICommonAPIService;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;
import java.util.Set;

abstract public class AbstractMirrorLinkPlugin extends CordovaPlugin {
    protected static volatile ICommonAPIService mCommonAPI = null;
    protected static final String TAG = "mirrorBuse";
    protected static boolean isconnected = false;
    protected MirrorLinkCallback callbackLocal;
    protected Activity activity = null;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        activity = cordova.getActivity();
    }

    protected JSONObject BundleToJSONObject(Bundle b) {
        JSONObject j = new JSONObject();
        Set<String> keys = b.keySet();
        for (String key : keys) {
            try {
                j.put(key, b.get(key));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        return j;
    }

    protected JSONArray ListBundleToJSONArray(List<Bundle> lb) {
        JSONArray ja = new JSONArray();
        for (Bundle b : lb ) {
            ja.put(BundleToJSONObject(b));
        }
        return ja;
    }
}