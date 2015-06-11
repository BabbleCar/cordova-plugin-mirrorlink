package com.babblecar.mirrorlink;

import android.os.RemoteException;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.apache.cordova.CallbackContext;

import com.mirrorlink.android.commonapi.IContextManager;
import com.mirrorlink.android.commonapi.IDeviceStatusListener;
import com.mirrorlink.android.commonapi.IDeviceStatusManager;

public class DeviceStatus extends AbstractMirrorLinkPlugin {

    private volatile IDeviceStatusManager mDeviceStatusManager = null;

    private CallbackContext callbackDriveMode = null;
    private CallbackContext callbackNightMode = null;
    private CallbackContext callbackMicrophoneStatus = null;

    private final IDeviceStatusListener mDeviceStatusListener = new IDeviceStatusListener.Stub() {
        @Override
        public void onDriveModeChange(boolean driveMode) throws RemoteException {
            if(callbackDriveMode!=null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, driveMode);
                result.setKeepCallback(true);
                callbackDriveMode.sendPluginResult(result);
            }
        }
        @Override
        public void onNightModeChanged(boolean nightMode) throws RemoteException {
            if(callbackNightMode!=null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, nightMode);
                result.setKeepCallback(true);
                callbackNightMode.sendPluginResult(result);
            }
        }
        @Override
        public void onMicrophoneStatusChanged(boolean micInput) throws RemoteException {
            if(callbackMicrophoneStatus!=null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, micInput);
                result.setKeepCallback(true);
                callbackMicrophoneStatus.sendPluginResult(result);
            }
        }
    };

    public boolean execute(String action, final JSONArray args, CallbackContext callbackContext) throws JSONException {

        if(!isconnected) {
            callbackContext.error("service is not connected");
            return false;
        }

        if("onDriveModeChange".equals(action)) {
            callbackDriveMode = callbackContext;
        }else if("onNightModeChanged".equals(action)){
            callbackNightMode = callbackContext;
        }else if("onMicrophoneStatusChanged".equals(action)){
            callbackMicrophoneStatus = callbackContext;
        }else if("isInDriveMode".equals(action)) {
            try {
                callbackContext.success(String.valueOf(getDeviceStatusManager().isInDriveMode()));
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }else if("isInNightMode".equals(action)) {
            try {
                callbackContext.success(String.valueOf(getDeviceStatusManager().isInNightMode()));
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }else if("isMicrophoneOn".equals(action)) {
            try {
                callbackContext.success(String.valueOf(getDeviceStatusManager().isMicrophoneOn()));
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }else if("setMicrophoneOpen".equals(action)) {
            try {
                callbackContext.success(String.valueOf(getDeviceStatusManager().setMicrophoneOpen(args.getBoolean(0), args.getBoolean(1))));
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        } else {
            callbackContext.error("AlertPlugin." + action + " not found !");
            return false;
        }

        return true;
    }

    protected IDeviceStatusManager getDeviceStatusManager() {
        if (mDeviceStatusManager == null) {
            try {
                mDeviceStatusManager = mCommonAPI.getDeviceStatusManager(activity.getPackageName(), mDeviceStatusListener);
            } catch (RemoteException e) {
                mDeviceStatusManager = null;
            }
        }

        return mDeviceStatusManager;
    }
}
