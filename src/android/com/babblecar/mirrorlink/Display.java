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
    private CallbackContext callbackGetClientPixelFormat = null;
    private CallbackContext callbackGetDisplayConfiguration = null;

    private final IDisplayListener mDisplayListener = new IDisplayListener.Stub() {
        @Override
        public void onDisplayConfigurationChanged(Bundle displayConfiguration) throws RemoteException {
            if(callbackOnDisplayConfigurationChanged!=null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, BundleToJSONObject(displayConfiguration));
                result.setKeepCallback(true);
                callbackOnDisplayConfigurationChanged.sendPluginResult(result);
            }
        }
        @Override
        public void onPixelFormatChanged(Bundle pixelFormat) throws RemoteException {
            if(callbackOnPixelFormatChanged!=null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, BundleToJSONObject(pixelFormat));
                result.setKeepCallback(true);
                callbackOnPixelFormatChanged.sendPluginResult(result);
            }
        }
    };

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if("onDisplayConfigurationChanged".equals(action)) {
            callbackOnDisplayConfigurationChanged = callbackContext;
            callbackLocal = null;
            execlocal();
            return true;
        }else if("onPixelFormatChanged".equals(action)){
            callbackOnPixelFormatChanged = callbackContext;
            callbackLocal = null;
            execlocal();
            return true;
        }else if("getClientPixelFormat".equals(action)) {
            callbackGetClientPixelFormat = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        callbackGetClientPixelFormat.success(BundleToJSONObject(mDisplayManager.getClientPixelFormat()));
                    } catch (RemoteException e) {
                        e.printStackTrace();
                    }
                }
            };
            execlocal();
            return true;
        }else if("eventMappings".equals(action)) {
            callbackGetDisplayConfiguration = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        callbackGetDisplayConfiguration.success(BundleToJSONObject(mDisplayManager.getDisplayConfiguration()));
                    } catch (RemoteException e) {
                        e.printStackTrace();
                    }
                }
            };
            execlocal();
            return true;
        }

        callbackContext.error("AlertPlugin." + action + " not found !");
        return false;
    }

    protected void execlocal() {
        if (mDisplayManager == null) {
            callbackBind = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        mDisplayManager = mCommonAPI.getDisplayManager(activity.getPackageName(), mDisplayListener);
                        if(callbackLocal!=null) {
                            callbackLocal.callbackCall();
                        }
                    } catch (RemoteException e) {
                        mDisplayManager = null;
                    }
                }
            };
            exec();
        } else {
            if(callbackLocal!=null) {
                callbackLocal.callbackCall();
            }
        }
    }
}