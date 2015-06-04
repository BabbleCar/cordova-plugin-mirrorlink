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
    private CallbackContext callbackGetAudioConnections = null;
    private CallbackContext callbackGetRemoteDisplayConnections = null;
    private CallbackContext callbackIsMirrorLinkSessionEstablished = null;

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
        if("onMirrorLinkSessionChanged".equals(action)) {
            callbackOnMirrorLinkSessionChanged = callbackContext;
            callbackLocal = null;
            execlocal();
            return true;
        }else if("onAudioConnectionsChanged".equals(action)){
            callbackOnAudioConnectionsChanged = callbackContext;
            callbackLocal = null;
            execlocal();
            return true;
        }else if("onRemoteDisplayConnectionChanged".equals(action)){
            callbackOnRemoteDisplayConnectionChanged = callbackContext;
            callbackLocal = null;
            execlocal();
            return true;
        }else if("getAudioConnections".equals(action)) {
            callbackGetAudioConnections = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        callbackGetAudioConnections.success(BundleToJSONObject(mConnectionManager.getAudioConnections()));
                    } catch (RemoteException e) {
                        e.printStackTrace();
                    }
                }
            };
            execlocal();
            return true;
        }else if("getRemoteDisplayConnections".equals(action)) {
            callbackGetRemoteDisplayConnections = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        callbackGetRemoteDisplayConnections.success(mConnectionManager.getRemoteDisplayConnections());
                    } catch (RemoteException e) {
                        e.printStackTrace();
                    }
                }
            };
            execlocal();
            return true;
        }else if("isMirrorLinkSessionEstablished".equals(action)) {
            callbackIsMirrorLinkSessionEstablished = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        callbackIsMirrorLinkSessionEstablished.success(mConnectionManager.isMirrorLinkSessionEstablished() ? 1 : 0 );
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
        if (mConnectionManager == null) {
            callbackBind = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        mConnectionManager = mCommonAPI.getConnectionManager(activity.getPackageName(), mConnectionListener);
                        if(callbackLocal!=null) {
                            callbackLocal.callbackCall();
                        }
                    } catch (RemoteException e) {
                        mConnectionManager = null;
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