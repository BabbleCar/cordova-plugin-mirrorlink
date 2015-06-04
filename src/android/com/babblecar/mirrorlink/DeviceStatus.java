package com.babblecar.mirrorlink;

import android.os.RemoteException;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.apache.cordova.CallbackContext;
import com.mirrorlink.android.commonapi.IDeviceStatusListener;
import com.mirrorlink.android.commonapi.IDeviceStatusManager;

public class DeviceStatus extends AbstractMirrorLinkPlugin {

    private volatile IDeviceStatusManager mDeviceStatusManager = null;

    private CallbackContext callbackDriveMode = null;
    private CallbackContext callbackNightMode = null;
    private CallbackContext callbackMicrophoneStatus = null;
    private CallbackContext callbackIsInDriveMode = null;
    private CallbackContext callbackIsInNightMode = null;
    private CallbackContext callbackIsMicrophoneOn = null;
    private CallbackContext callbackSetMicrophoneOpen = null;

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
        if("onDriveModeChange".equals(action)) {
            callbackDriveMode = callbackContext;
            callbackLocal = null;
            execlocal();
            return true;
        }else if("onNightModeChanged".equals(action)){
            callbackNightMode = callbackContext;
            callbackLocal = null;
            execlocal();
            return true;
        }else if("onMicrophoneStatusChanged".equals(action)){
            callbackMicrophoneStatus = callbackContext;
            callbackLocal = null;
            execlocal();
            return true;
        }else if("isInDriveMode".equals(action)) {
            callbackIsInDriveMode = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        callbackIsInDriveMode.success(String.valueOf(mDeviceStatusManager.isInDriveMode()));
                    } catch (RemoteException e) {
                        e.printStackTrace();
                    }
                }
            };
            execlocal();
            return true;
        }else if("isInNightMode".equals(action)) {
            callbackIsInNightMode = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        callbackIsInNightMode.success(String.valueOf(mDeviceStatusManager.isInNightMode()));
                    } catch (RemoteException e) {
                        e.printStackTrace();
                    }
                }
            };
            execlocal();
            return true;
        }else if("isMicrophoneOn".equals(action)) {
            callbackIsMicrophoneOn = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        callbackIsMicrophoneOn.success(String.valueOf(mDeviceStatusManager.isMicrophoneOn()));
                    } catch (RemoteException e) {
                        e.printStackTrace();
                    }
                }
            };
            execlocal();
            return true;
        }else if("setMicrophoneOpen".equals(action)) {
            callbackSetMicrophoneOpen = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        callbackSetMicrophoneOpen.success(String.valueOf(mDeviceStatusManager.setMicrophoneOpen(args.getBoolean(0), args.getBoolean(1))));
                    } catch (RemoteException e) {
                        e.printStackTrace();
                    } catch (JSONException e) {
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
        if (mDeviceStatusManager == null) {
            callbackBind = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        mDeviceStatusManager = mCommonAPI.getDeviceStatusManager(activity.getPackageName(), mDeviceStatusListener);
                        if(callbackLocal!=null) {
                            callbackLocal.callbackCall();
                        }
                    } catch (RemoteException e) {
                        mDeviceStatusManager = null;
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
