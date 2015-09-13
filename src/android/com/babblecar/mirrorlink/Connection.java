package com.babblecar.mirrorlink;

import android.os.Bundle;
import android.os.RemoteException;

import com.mirrorlink.android.commonapi.IConnectionListener;
import com.mirrorlink.android.commonapi.IConnectionManager;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

public class Connection extends AbstractMirrorLinkPlugin {

    private volatile IConnectionManager mConnectionManager = null;

    private CallbackContext callbackOnMirrorLinkSessionChanged = null;
    private CallbackContext callbackOnRemoteDisplayConnectionChanged = null;
    private CallbackContext callbackOnAudioConnectionsChanged = null;

    private final IConnectionListener mConnectionListener = new IConnectionListener.Stub() {
        @Override
        public void onMirrorLinkSessionChanged(boolean mirrolinkSessionIsEstablished) throws RemoteException {
            if (callbackOnMirrorLinkSessionChanged != null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, mirrolinkSessionIsEstablished);
                result.setKeepCallback(true);
                callbackOnMirrorLinkSessionChanged.sendPluginResult(result);
            }
        }

        @Override
        public void onAudioConnectionsChanged(Bundle audioConnections) throws RemoteException {
            if (callbackOnAudioConnectionsChanged != null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, BundleToJSONObject(audioConnections));
                result.setKeepCallback(true);
                callbackOnAudioConnectionsChanged.sendPluginResult(result);
            }
        }

        @Override
        public void onRemoteDisplayConnectionChanged(int remoteDisplayConnection) throws RemoteException {
            if (callbackOnRemoteDisplayConnectionChanged != null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, remoteDisplayConnection);
                result.setKeepCallback(true);
                callbackOnRemoteDisplayConnectionChanged.sendPluginResult(result);
            }
        }
    };

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        if (!isconnected) {
            callbackContext.error("service is not connected");
            return false;
        }

        //4.4.1 return bool
        if ("isMirrorLinkSessionEstablished".equals(action)) {
            try {
                callbackContext.success(getConnectionManager().isMirrorLinkSessionEstablished() ? 1 : 0);
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            //4.4.2 return bool
        } else if ("onMirrorLinkSessionChanged".equals(action)) {
            callbackOnMirrorLinkSessionChanged = callbackContext;
            getConnectionManager();
            //4.4.3 return bundle
        } else if ("getAudioConnections".equals(action)) {
            try {
                callbackContext.success(BundleToJSONObject(getConnectionManager().getAudioConnections()));
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            //4.4.4 return bundle
        } else if ("onAudioConnectionsChanged".equals(action)) {
            callbackOnAudioConnectionsChanged = callbackContext;
            getConnectionManager();
            //4.4.5 return int
        } else if ("getRemoteDisplayConnections".equals(action)) {
            try {
                callbackContext.success(getConnectionManager().getRemoteDisplayConnections());
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            // 4.4.6 return int
        } else if ("onRemoteDisplayConnectionChanged".equals(action)) {
            callbackOnRemoteDisplayConnectionChanged = callbackContext;
            getConnectionManager();
        } else if ("unregister".equals(action)) {
            try {
                getConnectionManager().unregister();
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

    protected IConnectionManager getConnectionManager() {
        if (mConnectionManager == null) {
            try {
                mConnectionManager = mCommonAPI.getConnectionManager(activity.getPackageName(), mConnectionListener);
            } catch (RemoteException e) {
                mConnectionManager = null;
            }
        }
        return mConnectionManager;
    }
}