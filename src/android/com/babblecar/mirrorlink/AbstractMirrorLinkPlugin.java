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
    protected MirrorLinkCallback callbackBind;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        Log.v(TAG, "INITIALIZE");
        activity = cordova.getActivity();
    }

    protected Intent findCommonAPIIntent() {
        Intent commonAPIIntent = new Intent(com.mirrorlink.android.commonapi.Defs.Intents.BIND_MIRRORLINK_API);
        PackageManager pm = activity.getPackageManager();
        List<ResolveInfo> resolveInfo = pm.queryIntentServices(commonAPIIntent, 0);
        if (resolveInfo == null || resolveInfo.size() != 1) {
            Log.e(TAG, "Multiple CommonAPI services are available, one is likely not to be trusted!");
        }
        assert resolveInfo != null;
        ResolveInfo serviceInfo;
        serviceInfo = resolveInfo.get(0);
        String packageName = serviceInfo.serviceInfo.packageName;
        String className = serviceInfo.serviceInfo.name;
        ComponentName component = new ComponentName(packageName, className);
        commonAPIIntent.setComponent(component);
        return commonAPIIntent;
    }

    synchronized protected void exec() {
        if(!isconnected) {
            try {
                Intent intent = findCommonAPIIntent();
                if (intent != null) {
                    activity.bindService(intent, new ServiceConnection() {
                        public void onServiceDisconnected(ComponentName name) {
                            isconnected=false;
                        }
                        public void onServiceConnected(ComponentName name, IBinder service) {
                            isconnected=true;
                            mCommonAPI = ICommonAPIService.Stub.asInterface(service);
                            try {
                                mCommonAPI.applicationStarted(activity.getPackageName(), mCommonAPI.getCommonAPIServiceApiLevel());
                            } catch (RemoteException e) {
                                e.printStackTrace();
                            }
                            if(callbackBind!=null) {
                                callbackBind.callbackCall();
                            }
                        }
                    }, Context.BIND_AUTO_CREATE);
                }
            } catch (SecurityException e) {
                Log.v(TAG, "NO common API");
            }
        } else {
            if(callbackBind!=null) {
                callbackBind.callbackCall();
            }
        }
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