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
            if(callbackOnMirrorLinkSessionChanged!=null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, mirrolinkSessionIsEstablished);
                result.setKeepCallback(true);
                callbackOnMirrorLinkSessionChanged.sendPluginResult(result);
            }
        }
        @Override
        public void onAudioConnectionsChanged(Bundle audioConnections) throws RemoteException {
            if(callbackOnAudioConnectionsChanged!=null) {
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

        callbackLocal = null;

        switch (action) {
            case "onMirrorLinkSessionChanged":
                callbackOnMirrorLinkSessionChanged = callbackContext;
                break;
            case "onAudioConnectionsChanged":
                callbackOnAudioConnectionsChanged = callbackContext;
                break;
            case "onRemoteDisplayConnectionChanged":
                callbackOnRemoteDisplayConnectionChanged = callbackContext;
                break;
            case "getAudioConnections":
                try {
                    callbackContext.success(BundleToJSONObject(getConnectionManager().getAudioConnections()));
                } catch (RemoteException e) {
                    e.printStackTrace();
                }
                break;
            case "getRemoteDisplayConnections":
                try {
                    callbackContext.success(getConnectionManager().getRemoteDisplayConnections());
                } catch (RemoteException e) {
                    e.printStackTrace();
                }
                break;
            case "isMirrorLinkSessionEstablished":
                try {
                    callbackContext.success(getConnectionManager().isMirrorLinkSessionEstablished() ? 1 : 0);
                } catch (RemoteException e) {
                    e.printStackTrace();
                }
                break;
            case "unregister" :
                try {
                    getConnectionManager().unregister();
                    callbackContext.success();
                } catch (RemoteException e) {
                    e.printStackTrace();
                }
                break;
            default:
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