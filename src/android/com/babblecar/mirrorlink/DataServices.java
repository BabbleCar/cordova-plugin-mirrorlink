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
    private CallbackContext callbackGetAvailableServices = null;
    private CallbackContext callbackGetObject = null;
    private CallbackContext callbackRegisterToService = null;
    //private CallbackContext callbackSetObject = null;

    private final IDataServicesListener mDataServicesListener = new IDataServicesListener.Stub() {
        @Override
        public void onAvailableServicesChanged(List<Bundle> services) throws RemoteException {
            if(callbackOnAvailableServicesChanged!=null) {
                JSONArray jservices = new JSONArray();

                for (Bundle b : services) {
                    jservices.put(BundleToJSONObject(b));
                }

                PluginResult result = new PluginResult(PluginResult.Status.OK,jservices);
                result.setKeepCallback(true);
                callbackOnAvailableServicesChanged.sendPluginResult(result);
            }
        }

        @Override
        public void onRegisterForService(int serviceId, boolean success) throws RemoteException {
            if(callbackOnRegisterForService!=null) {
                JSONObject j = new JSONObject();
                try {
                    j.put("serviceId", serviceId);
                    j.put("success", success);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                PluginResult result = new PluginResult(PluginResult.Status.OK,j);
                result.setKeepCallback(true);
                callbackOnRegisterForService.sendPluginResult(result);
            }
        }

        @Override
        public void onSubscribeResponse(int serviceId, int objectId, boolean success, int subscriptionType, int interval) throws RemoteException {
            if(callbackOnSubscribeResponse!=null) {
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
                PluginResult result = new PluginResult(PluginResult.Status.OK,j);
                result.setKeepCallback(true);
                callbackOnSubscribeResponse.sendPluginResult(result);
            }
        }

        @Override
        public void onSetDataObjectResponse(int serviceId, int objectId, boolean success) throws RemoteException {
            if(callbackOnSetDataObjectResponse!=null) {
                JSONObject j = new JSONObject();
                try {
                    j.put("serviceId", serviceId);
                    j.put("objectId", objectId);
                    j.put("success", success);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                PluginResult result = new PluginResult(PluginResult.Status.OK,j);
                result.setKeepCallback(true);
                callbackOnSetDataObjectResponse.sendPluginResult(result);
            }
        }

        @Override
        public void onGetDataObjectResponse(int serviceId, int objectId, boolean success, Bundle object) throws RemoteException {
            if(callbackOnGetDataObjectResponse!=null) {
                JSONObject j = new JSONObject();
                try {
                    j.put("serviceId", serviceId);
                    j.put("objectId", objectId);
                    j.put("success", success);
                    j.put("object", BundleToJSONObject(object));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                PluginResult result = new PluginResult(PluginResult.Status.OK,j);
                result.setKeepCallback(true);
                callbackOnGetDataObjectResponse.sendPluginResult(result);
            }
        }
    };

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if("onAvailableServicesChanged".equals(action)) {
            callbackOnAvailableServicesChanged = callbackContext;
            callbackLocal = null;
            execlocal();
            return true;
        }else if("onRegisterForService".equals(action)){
            callbackOnRegisterForService = callbackContext;
            callbackLocal = null;
            execlocal();
            return true;
        }else if("onSubscribeResponse".equals(action)) {
            callbackOnSubscribeResponse = callbackContext;
            callbackLocal = null;
            execlocal();
            return true;
        }else if("onSetDataObjectResponse".equals(action)) {
            callbackOnSetDataObjectResponse = callbackContext;
            callbackLocal = null;
            execlocal();
            return true;
        }else if("onGetDataObjectResponse".equals(action)) {
            callbackOnGetDataObjectResponse = callbackContext;
            callbackLocal = null;
            execlocal();
            return true;
        }else if("getAvailableServices".equals(action)) {
            callbackGetAvailableServices = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        callbackGetAvailableServices.success(ListBundleToJSONArray(mDataServicesManager.getAvailableServices()));
                    } catch (RemoteException e) {
                        e.printStackTrace();
                    }
                }
            };
            execlocal();
            return true;
        }else if("getObject".equals(action)) {
            callbackGetObject = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        mDataServicesManager.getObject(args.getInt(0), args.getInt(1));
                        callbackGetObject.success();
                    } catch (RemoteException | JSONException e) {
                        e.printStackTrace();
                    }
                }
            };
            execlocal();
            return true;
        }else if("registerToService".equals(action)) {
            callbackRegisterToService = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        mDataServicesManager.registerToService(args.getInt(0), args.getInt(1),args.getInt(2));
                        callbackRegisterToService.success();
                    } catch (RemoteException | JSONException e) {
                        e.printStackTrace();
                    }
                }
            };
            execlocal();
            return true;
        }
        //TODO do setObject
        /*else if("setObject".equals(action)) {
            callbackSetObject = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        JSONObject jo = args.getJSONObject(2);

                        Bundle LATITUDE_FIELD_UID = new Bundle();
                        LATITUDE_FIELD_UID.putDouble(Defs.DataObjectKeys.VALUE, cLatitude.getValue());
                        coords.putBundle(Defs.LocationService.LATITUDE_FIELD_UID, LATITUDE_FIELD_UID);

                        Bundle LONGITUDE_FIELD_UID = new Bundle();
                        LONGITUDE_FIELD_UID.putDouble(Defs.DataObjectKeys.VALUE, cLongtitue.getValue());
                        coords.putBundle(Defs.LocationService.LONGITUDE_FIELD_UID, LONGITUDE_FIELD_UID);

                        Bundle ALTITUDE_FIELD_UID = new Bundle();
                        LATITUDE_FIELD_UID.putDouble(Defs.DataObjectKeys.VALUE, cAltitude.getValue());
                        coords.putBundle(Defs.LocationService.ALTITUDE_FIELD_UID, ALTITUDE_FIELD_UID);

                        Bundle ACCURACY_FIELD_UID = new Bundle();
                        LATITUDE_FIELD_UID.putDouble(Defs.DataObjectKeys.VALUE, cAccuracy.getValue());
                        coords.putBundle(Defs.LocationService.ACCURACY_FIELD_UID, ACCURACY_FIELD_UID);

                        Bundle ALTITUDEACCURACY_FIELD_UID = new Bundle();
                        LATITUDE_FIELD_UID.putDouble(Defs.DataObjectKeys.VALUE, cAltAccuracy.getValue());
                        coords.putBundle(Defs.LocationService.ALTITUDEACCURACY_FIELD_UID, ALTITUDEACCURACY_FIELD_UID);

                        Bundle HEADING_FIELD_UID = new Bundle();
                        LATITUDE_FIELD_UID.putDouble(Defs.DataObjectKeys.VALUE, cHeading.getValue());
                        coords.putBundle(Defs.LocationService.HEADING_FIELD_UID, HEADING_FIELD_UID);

                        Bundle SPEED_FIELD_UID = new Bundle();
                        LATITUDE_FIELD_UID.putDouble(Defs.DataObjectKeys.VALUE, cSpeed.getValue());
                        coords.putBundle(Defs.LocationService.SPEED_FIELD_UID, SPEED_FIELD_UID);

                        locationObject.putBundle(Defs.LocationService.COORD_FIELD_UID, coords);

                        Date d = new Date();
                        locationObject.putLong(Defs.LocationService.TIMESTAMP_FIELD_UID, d.getTime());

                        try {
                            mAppContext.getDataServicesManager().setObject(mDataServiceId, Defs.LocationService.LOCATION_OBJECT_UID, locationObject);

                        Bundle b = new Bundle();
                        for (int i = 0; i < jo.length(); i++) {
                            b.p
                        }

                        mDataServicesManager.setObject(args.getInt(0), args.get(1),);
                        callbackSetObject.success();
                    } catch (RemoteException | JSONException e) {
                        e.printStackTrace();
                    }
                }
            };
            execlocal();
            return true;
        }*/

        callbackContext.error("AlertPlugin." + action + " not found !");
        return false;
    }

    protected void execlocal() {
        if (mDataServicesManager == null) {
            callbackBind = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        mDataServicesManager = mCommonAPI.getDataServicesManager(activity.getPackageName(), mDataServicesListener);
                        if(callbackLocal!=null) {
                            callbackLocal.callbackCall();
                        }
                    } catch (RemoteException e) {
                        mDataServicesManager = null;
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