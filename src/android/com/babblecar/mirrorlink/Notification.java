package com.babblecar.mirrorlink;

import android.net.Uri;
import android.os.Bundle;
import android.os.RemoteException;
import com.mirrorlink.android.commonapi.Defs;
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

    private CallbackContext callbackGetNotificationEnabled = null;
    private CallbackContext callbackGetNotificationConfiguration = null;
    private CallbackContext callbackOnNotificationActionReceived = null;
    private CallbackContext callbackOnNotificationConfigurationChanged = null;
    private CallbackContext callbackOnNotificationEnabledChanged = null;
    private CallbackContext callbackCancelNotification = null;
    private CallbackContext callbackSendVncNotification = null;
    private CallbackContext callbackSendClientNotification = null;

    private final INotificationListener mNotificationListener = new INotificationListener.Stub() {
        @Override
        public void onNotificationEnabledChanged(boolean notiEnabled) throws RemoteException {
            if(callbackOnNotificationEnabledChanged!=null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, notiEnabled);
                result.setKeepCallback(true);
                callbackOnNotificationEnabledChanged.sendPluginResult(result);
            }
        }
        @Override
        public void onNotificationConfigurationChanged(Bundle notificationConfiguration) throws RemoteException {
            if(callbackOnNotificationConfigurationChanged!=null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, BundleToJSONObject(notificationConfiguration));
                result.setKeepCallback(true);
                callbackOnNotificationConfigurationChanged.sendPluginResult(result);
            }
        }
        @Override
        public void onNotificationActionReceived(int notificationId, int actionId) throws RemoteException {
            if(callbackOnNotificationActionReceived!=null) {
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
        if("onNotificationEnabledChanged".equals(action)) {
            callbackOnNotificationEnabledChanged = callbackContext;
            callbackLocal = null;
            execlocal();
            return true;
        }else if("onNotificationConfigurationChanged".equals(action)){
            callbackOnNotificationConfigurationChanged = callbackContext;
            callbackLocal = null;
            execlocal();
            return true;
        }else if("onNotificationActionReceived".equals(action)){
            callbackOnNotificationActionReceived = callbackContext;
            callbackLocal = null;
            execlocal();
            return true;
        }else if("getNotificationConfiguration".equals(action)) {
            callbackGetNotificationConfiguration = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        callbackGetNotificationConfiguration.success(String.valueOf(mNotificationManager.getNotificationConfiguration()));
                    } catch (RemoteException e) {
                        e.printStackTrace();
                    }
                }
            };
            execlocal();
            return true;
        }else if("getNotificationEnabled".equals(action)) {
            callbackGetNotificationEnabled = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        callbackGetNotificationEnabled.success(String.valueOf(mNotificationManager.getNotificationEnabled()));
                    } catch (RemoteException e) {
                        e.printStackTrace();
                    }
                }
            };
            execlocal();
            return true;
        }else if("cancelNotification".equals(action)) {
            callbackCancelNotification = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        callbackCancelNotification.success(String.valueOf(mNotificationManager.cancelNotification(args.getInt(0))));
                    } catch (RemoteException | JSONException e) {
                        e.printStackTrace();
                    }
                }
            };
            execlocal();
            return true;
        }else if("sendVncNotification".equals(action)) {
            callbackSendVncNotification = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        callbackSendVncNotification.success(String.valueOf(mNotificationManager.sendVncNotification()));
                    } catch (RemoteException e) {
                        e.printStackTrace();
                    }
                }
            };
            execlocal();
            return true;
        }else if("sendClientNotification".equals(action)) {
            callbackSendClientNotification = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        List<Bundle> actions = new ArrayList<>();
                        JSONArray jo = args.getJSONArray(3);
                        for (int i=0;i<jo.length();i++) {
                            //TODO  Check action with array relational (for json object)
                            Bundle action =  new Bundle();
                            action.putInt(Defs.Action.ACTION_ID, i + 1);
                            //action.putString(Defs.Action.ICON_URL, i+1);
                            action.putString(Defs.Action.ACTION_NAME, jo.getString(i));
                            action.putBoolean(Defs.Action.LAUNCH_APP, false);
                            actions.add(action);
                        }
                        callbackSendClientNotification.success(String.valueOf(mNotificationManager.sendClientNotification(args.getString(0), args.getString(1), Uri.parse(args.getString(2)), actions)));
                    } catch (RemoteException | JSONException e) {
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
        if (mNotificationManager == null) {
            callbackBind = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        mNotificationManager = mCommonAPI.getNotificationManager(activity.getPackageName(), mNotificationListener);
                        if(callbackLocal!=null) {
                            callbackLocal.callbackCall();
                        }
                    } catch (RemoteException e) {
                        mNotificationManager = null;
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