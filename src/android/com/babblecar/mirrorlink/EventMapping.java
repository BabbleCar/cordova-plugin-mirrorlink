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

        if(!isconnected) {
            callbackContext.error("service is not connected");
            return false;
        }

        if("onEventConfigurationChanged".equals(action)) {
            callbackOnEventConfiguration = callbackContext;
            getEventMappingManager();
        }else if("onEventMappingChanged".equals(action)){
            callbackOnEventMapping = callbackContext;
            getEventMappingManager();
        }else if("getEventConfiguration".equals(action)){
            try {
                callbackContext.success(String.valueOf(getEventMappingManager().getEventConfiguration()));
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }else if("getEventMappings".equals(action)){
            try {
                callbackContext.success(String.valueOf(getEventMappingManager().getEventMappings()));
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }else {
            callbackContext.error("AlertPlugin." + action + " not found !");
            return false;
        }

        return true;
    }

    protected IEventMappingManager getEventMappingManager() {
        if (mEventMappingManager == null) {
            try {
                mEventMappingManager = mCommonAPI.getEventMappingManager(activity.getPackageName(), mEventMappingListener);
            } catch (RemoteException e) {
                mEventMappingManager = null;
            }
        }

        return mEventMappingManager;
    }
}