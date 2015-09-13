package com.babblecar.mirrorlink;

import android.os.Bundle;
import android.os.RemoteException;

import com.mirrorlink.android.commonapi.IDisplayListener;
import com.mirrorlink.android.commonapi.IDisplayManager;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

public class Display extends AbstractMirrorLinkPlugin {

    private volatile IDisplayManager mDisplayManager = null;

    private CallbackContext callbackOnDisplayConfigurationChanged = null;
    private CallbackContext callbackOnPixelFormatChanged = null;

    private final IDisplayListener mDisplayListener = new IDisplayListener.Stub() {
        @Override
        public void onDisplayConfigurationChanged(Bundle displayConfiguration) throws RemoteException {
            if (callbackOnDisplayConfigurationChanged != null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, BundleToJSONObject(displayConfiguration));
                result.setKeepCallback(true);
                callbackOnDisplayConfigurationChanged.sendPluginResult(result);
            }
        }

        @Override
        public void onPixelFormatChanged(Bundle pixelFormat) throws RemoteException {
            if (callbackOnPixelFormatChanged != null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, BundleToJSONObject(pixelFormat));
                result.setKeepCallback(true);
                callbackOnPixelFormatChanged.sendPluginResult(result);
            }
        }
    };

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        if (!isconnected) {
            callbackContext.error("service is not connected");
            return false;
        }

        //4.5.1
        if ("getDisplayConfiguration".equals(action)) {
            try {
                callbackContext.success(BundleToJSONObject(getDisplayManager().getDisplayConfiguration()));
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            //4.5.2
        } else if ("onDisplayConfigurationChanged".equals(action)) {
            callbackOnDisplayConfigurationChanged = callbackContext;
            getDisplayManager();
            //4.5.3
        } else if ("getClientPixelFormat".equals(action)) {
            try {
                callbackContext.success(BundleToJSONObject(getDisplayManager().getClientPixelFormat()));
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            //4.5.4
        } else if ("onPixelFormatChanged".equals(action)) {
            callbackOnPixelFormatChanged = callbackContext;
            getDisplayManager();
        } else if ("unregister".equals(action)) {
            try {
                getDisplayManager().unregister();
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            callbackContext.success();
        } else {
            callbackContext.error("AlertPlugin." + action + " not found !");
            return false;
        }

        return true;
    }

    protected IDisplayManager getDisplayManager() {
        if (mDisplayManager == null) {
            try {
                mDisplayManager = mCommonAPI.getDisplayManager(activity.getPackageName(), mDisplayListener);
            } catch (RemoteException e) {
                mDisplayManager = null;
            }
        }

        return mDisplayManager;
    }
}