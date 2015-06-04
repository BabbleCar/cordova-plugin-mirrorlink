package com.babblecar.mirrorlink;

import android.os.Bundle;
import android.os.RemoteException;
import com.mirrorlink.android.commonapi.IEventMappingListener;
import com.mirrorlink.android.commonapi.IEventMappingManager;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

public class EventMapping extends AbstractMirrorLinkPlugin {

    private volatile IEventMappingManager mEventMappingManager = null;

    private CallbackContext callbackEventConfiguration = null;
    private CallbackContext callbackEventMapping = null;
    private CallbackContext callbackOnEventConfiguration = null;
    private CallbackContext callbackOnEventMapping = null;

    private final IEventMappingListener mEventMappingListener = new IEventMappingListener.Stub() {
        @Override
        public void onEventConfigurationChanged(Bundle eventConfiguration) throws RemoteException {
            if(callbackOnEventConfiguration!=null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, BundleToJSONObject(eventConfiguration));
                result.setKeepCallback(true);
                callbackOnEventConfiguration.sendPluginResult(result);
            }
        }
        @Override
        public void onEventMappingChanged(Bundle eventMapping) throws RemoteException {
            if(callbackOnEventMapping!=null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, BundleToJSONObject(eventMapping));
                result.setKeepCallback(true);
                callbackOnEventMapping.sendPluginResult(result);
            }
        }
    };

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if("onEventConfigurationChanged".equals(action)) {
            callbackOnEventConfiguration = callbackContext;
            callbackLocal = null;
            execlocal();
            return true;
        }else if("onEventMappingChanged".equals(action)){
            callbackOnEventMapping = callbackContext;
            callbackLocal = null;
            execlocal();
            return true;
        }else if("getEventConfiguration".equals(action)) {
            callbackEventConfiguration = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        callbackEventConfiguration.success(String.valueOf(mEventMappingManager.getEventConfiguration()));
                    } catch (RemoteException e) {
                        e.printStackTrace();
                    }
                }
            };
            execlocal();
            return true;
        }else if("getEventMappings".equals(action)) {
            callbackEventMapping = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        callbackEventMapping.success(String.valueOf(mEventMappingManager.getEventMappings()));
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
        if (mEventMappingManager == null) {
            callbackBind = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        mEventMappingManager = mCommonAPI.getEventMappingManager(activity.getPackageName(), mEventMappingListener);
                        if(callbackLocal!=null) {
                            callbackLocal.callbackCall();
                        }
                    } catch (RemoteException e) {
                        mEventMappingManager = null;
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