package com.babblecar.mirrorlink;

import android.net.Uri;
import android.os.Bundle;
import android.os.RemoteException;

import com.mirrorlink.android.commonapi.INotificationListener;
import com.mirrorlink.android.commonapi.INotificationManager;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class Notification extends AbstractMirrorLinkPlugin {

    private volatile INotificationManager mNotificationManager = null;

    private CallbackContext callbackOnNotificationActionReceived = null;
    private CallbackContext callbackOnNotificationConfigurationChanged = null;
    private CallbackContext callbackOnNotificationEnabledChanged = null;

    private final INotificationListener mNotificationListener = new INotificationListener.Stub() {
        @Override
        public void onNotificationEnabledChanged(boolean notiEnabled) throws RemoteException {
            if (callbackOnNotificationEnabledChanged != null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, notiEnabled);
                result.setKeepCallback(true);
                callbackOnNotificationEnabledChanged.sendPluginResult(result);
            }
        }

        @Override
        public void onNotificationConfigurationChanged(Bundle notificationConfiguration) throws RemoteException {
            if (callbackOnNotificationConfigurationChanged != null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, BundleToJSONObject(notificationConfiguration));
                result.setKeepCallback(true);
                callbackOnNotificationConfigurationChanged.sendPluginResult(result);
            }
        }

        @Override
        public void onNotificationActionReceived(int notificationId, int actionId) throws RemoteException {
            if (callbackOnNotificationActionReceived != null) {
                JSONObject j = new JSONObject();
                try {
                    j.put("notificationId", notificationId);
                    j.put("actionId", actionId);
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                PluginResult result = new PluginResult(PluginResult.Status.OK, j);
                result.setKeepCallback(true);
                callbackOnNotificationActionReceived.sendPluginResult(result);
            }
        }
    };

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        if (!isconnected) {
            callbackContext.error("service is not connected");
            return false;
        }

        //4.12.1
        if ("setNotificationSupported".equals(action)) {
            try {
                getNotificationManager().setNotificationSupported(args.getBoolean(0));
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            callbackContext.success();
            //4.12.2
        } else if ("getNotificationEnabled".equals(action)) {
            try {
                callbackContext.success(getNotificationManager().getNotificationEnabled() ? 1 : 0);
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            //4.12.3
        } else if ("onNotificationEnabledChanged".equals(action)) {
            callbackOnNotificationEnabledChanged = callbackContext;
            getNotificationManager();
            //4.12.4
        } else if ("getNotificationConfiguration".equals(action)) {
            try {
                callbackContext.success(BundleToJSONObject(getNotificationManager().getNotificationConfiguration()));
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            //4.12.5
        } else if ("onNotificationConfigurationChanged".equals(action)) {
            callbackOnNotificationConfigurationChanged = callbackContext;
            getNotificationManager();
            //4.12.6
        } else if ("sendClientNotification".equals(action)) {
            try {
                List<String> actions = new ArrayList<String>();
                JSONArray jo = args.getJSONArray(3);
                for (int i = 0; i < jo.length(); i++) {
                    actions.add(jo.getString(i));
                }
                callbackContext.success(getNotificationManager().sendClientNotification(args.getString(0), args.getString(1), Uri.parse(args.getString(2)), actions));
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            //4.12.7
        } else if ("sendVncNotification".equals(action)) {
            try {
                callbackContext.success(getNotificationManager().sendVncNotification());
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            //4.12.8
        } else if ("cancelNotification".equals(action)) {
            try {
                callbackContext.success(getNotificationManager().cancelNotification(args.getInt(0)) ? 1 : 0);
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            //4.12.9
        } else if ("onNotificationActionReceived".equals(action)) {
            callbackOnNotificationActionReceived = callbackContext;
            getNotificationManager();
        } else if ("unregister".equals(action)) {
            try {
                getNotificationManager().unregister();
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

    protected INotificationManager getNotificationManager() {
        if (mNotificationManager == null) {
            try {
                mNotificationManager = mCommonAPI.getNotificationManager(activity.getPackageName(), mNotificationListener);
            } catch (RemoteException e) {
                mNotificationManager = null;
            }
        }

        return mNotificationManager;
    }
}