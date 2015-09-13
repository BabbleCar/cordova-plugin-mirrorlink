package com.babblecar.mirrorlink;

import android.content.*;
import android.content.Context;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.os.IBinder;
import android.os.RemoteException;

import com.mirrorlink.android.commonapi.ICommonAPIService;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;

import java.util.List;

public class Api extends AbstractMirrorLinkPlugin {

    private CallbackContext callbackBind = null;

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        if ("connect".equals(action)) {
            callbackBind = callbackContext;
            connect();

            return true;
        }

        return false;
    }

    private void connect() {
        Intent intent = findCommonAPIIntent();
        if (intent != null) {
            activity.bindService(intent, new ServiceConnection() {
                public void onServiceDisconnected(ComponentName name) {
                    mCommonAPI = null;
                    isconnected = false;
                }

                public void onServiceConnected(ComponentName name, IBinder service) {
                    isconnected = true;
                    mCommonAPI = ICommonAPIService.Stub.asInterface(service);
                    try {
                        mCommonAPI.applicationStarted(activity.getPackageName(), mCommonAPI.getCommonAPIServiceApiLevel());
                        callbackBind.success();
                    } catch (RemoteException e) {
                        mCommonAPI = null;
                        isconnected = false;
                    }
                }
            }, Context.BIND_AUTO_CREATE);
        }
    }

    protected Intent findCommonAPIIntent() {
        Intent commonAPIIntent = new Intent(com.mirrorlink.android.commonapi.Defs.Intents.BIND_MIRRORLINK_API);
        PackageManager pm = activity.getPackageManager();
        List<ResolveInfo> resolveInfo = pm.queryIntentServices(commonAPIIntent, 0);
        if (resolveInfo == null || resolveInfo.size() != 1) {
            // Log.e(TAG, "Multiple CommonAPI services are available, one is likely not to be trusted!");
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
}