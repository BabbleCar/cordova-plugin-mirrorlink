package com.babblecar.mirrorlink;

import android.os.Bundle;
import android.os.RemoteException;

import com.mirrorlink.android.commonapi.IDataServicesListener;
import com.mirrorlink.android.commonapi.IDataServicesManager;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

public class DataServices extends AbstractMirrorLinkPlugin {

    private volatile IDataServicesManager mDataServicesManager = null;

    private CallbackContext callbackOnAvailableServicesChanged = null;
    private CallbackContext callbackOnRegisterForService = null;
    private CallbackContext callbackOnSubscribeResponse = null;
    private CallbackContext callbackOnSetDataObjectResponse = null;
    private CallbackContext callbackOnGetDataObjectResponse = null;

    private final IDataServicesListener mDataServicesListener = new IDataServicesListener.Stub() {
        @Override
        public void onAvailableServicesChanged(List<Bundle> services) throws RemoteException {
            if (callbackOnAvailableServicesChanged != null) {
                JSONArray jservices = new JSONArray();

                for (Bundle b : services) {
                    jservices.put(BundleToJSONObject(b));
                }

                PluginResult result = new PluginResult(PluginResult.Status.OK, jservices);
                result.setKeepCallback(true);
                callbackOnAvailableServicesChanged.sendPluginResult(result);
            }
        }

        @Override
        public void onRegisterForService(int serviceId, boolean success) throws RemoteException {
            if (callbackOnRegisterForService != null) {
                JSONObject j = new JSONObject();
                try {
                    j.put("serviceId", serviceId);
                    j.put("success", success);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                PluginResult result = new PluginResult(PluginResult.Status.OK, j);
                result.setKeepCallback(true);
                callbackOnRegisterForService.sendPluginResult(result);
            }
        }

        @Override
        public void onSubscribeResponse(int serviceId, int objectId, boolean success, int subscriptionType, int interval) throws RemoteException {
            if (callbackOnSubscribeResponse != null) {
                JSONObject j = new JSONObject();
                try {
                    j.put("serviceId", serviceId);
                    j.put("objectId", objectId);
                    j.put("success", success);
                    j.put("subscriptionType", subscriptionType);
                    j.put("interval", interval);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                PluginResult result = new PluginResult(PluginResult.Status.OK, j);
                result.setKeepCallback(true);
                callbackOnSubscribeResponse.sendPluginResult(result);
            }
        }

        @Override
        public void onSetDataObjectResponse(int serviceId, int objectId, boolean success) throws RemoteException {
            if (callbackOnSetDataObjectResponse != null) {
                JSONObject j = new JSONObject();
                try {
                    j.put("serviceId", serviceId);
                    j.put("objectId", objectId);
                    j.put("success", success);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                PluginResult result = new PluginResult(PluginResult.Status.OK, j);
                result.setKeepCallback(true);
                callbackOnSetDataObjectResponse.sendPluginResult(result);
            }
        }

        @Override
        public void onGetDataObjectResponse(int serviceId, int objectId, boolean success, Bundle object) throws RemoteException {
            if (callbackOnGetDataObjectResponse != null) {
                JSONObject j = new JSONObject();
                try {
                    j.put("serviceId", serviceId);
                    j.put("objectId", objectId);
                    j.put("success", success);
                    j.put("object", BundleToJSONObject(object));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                PluginResult result = new PluginResult(PluginResult.Status.OK, j);
                result.setKeepCallback(true);
                callbackOnGetDataObjectResponse.sendPluginResult(result);
            }
        }
    };

    public boolean execute(String action, final JSONArray args, CallbackContext callbackContext) throws JSONException {

        if (!isconnected) {
            callbackContext.error("service is not connected");
            return false;
        }
        // 4.11.1
        if ("getAvailableServices".equals(action)) {
            try {
                callbackContext.success(ListBundleToJSONArray(getDataServicesManager().getAvailableServices()));
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            //4.11.2
        } else if ("onAvailableServicesChanged".equals(action)) {
            callbackOnAvailableServicesChanged = callbackContext;
            getDataServicesManager();
            //4.11.3
        } else if ("registerToService".equals(action)) {
            try {
                getDataServicesManager().registerToService(args.getInt(0), args.getInt(1), args.getInt(2));
                callbackContext.success();
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            //4.11.4
        } else if ("onRegisterForService".equals(action)) {
            callbackOnRegisterForService = callbackContext;
            getDataServicesManager();
            //4.11.5
        } else if ("unregisterFromService".equals(action)) {
            try {
                getDataServicesManager().unregisterFromService(args.getInt(0));
                callbackContext.success();
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            //4.11.6
        } else if ("subscribeObject".equals(action)) {
            try {
                getDataServicesManager().subscribeObject(args.getInt(0), args.getInt(1));
                callbackContext.success();
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            //4.11.7
        } else if ("onSubscribeResponse".equals(action)) {
            callbackOnSubscribeResponse = callbackContext;
            getDataServicesManager();
            //4.11.8
        } else if ("unsubscribeObject".equals(action)) {
            try {
                getDataServicesManager().unsubscribeObject(args.getInt(0), args.getInt(1));
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            callbackContext.success();
            //4.11.9
        } else if ("setObject".equals(action)) {
            try {
                getDataServicesManager().setObject(args.getInt(0), args.getInt(1), JSONObjectToBundle(args.getJSONObject(1)));
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            callbackContext.success();
            //4.11.10
        } else if ("onSetDataObjectResponse".equals(action)) {
            callbackOnSetDataObjectResponse = callbackContext;
            getDataServicesManager();
            //4.11.11
        } else if ("getObject".equals(action)) {
            try {
                getDataServicesManager().getObject(args.getInt(0), args.getInt(1));
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            callbackContext.success();
            //4.11.11
        } else if ("onGetDataObjectResponse".equals(action)) {
            callbackOnGetDataObjectResponse = callbackContext;
            getDataServicesManager();
        } else if ("unregister".equals(action)) {
            try {
                getDataServicesManager().unregister();
                callbackContext.success();
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        } else {
            callbackContext.error("AlertPlugin." + action + " not found !");
            return false;
        }

        return true;
    }

    protected IDataServicesManager getDataServicesManager() {
        if (mDataServicesManager == null) {
            try {
                mDataServicesManager = mCommonAPI.getDataServicesManager(activity.getPackageName(), mDataServicesListener);
            } catch (RemoteException e) {
                mDataServicesManager = null;
            }
        }

        return mDataServicesManager;
    }
}