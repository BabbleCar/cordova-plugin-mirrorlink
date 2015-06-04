package com.babblecar.mirrorlink;

import android.os.Bundle;
import android.os.RemoteException;
import com.mirrorlink.android.commonapi.IDeviceInfoListener;
import com.mirrorlink.android.commonapi.IDeviceInfoManager;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

public class DeviceInfo extends AbstractMirrorLinkPlugin {

    private volatile IDeviceInfoManager mDeviceInfoManager = null;

    private CallbackContext callbackOnDeviceInfoChanged = null;
    private CallbackContext callbackGetMirrorLinkClientInformation = null;
    private CallbackContext callbackGetServerVirtualKeyboardSupport = null;
    private CallbackContext callbackGetMirrorLinkSessionVersionMajor = null;
    private CallbackContext callbackGetMirrorLinkSessionVersionMinor = null;

    private final IDeviceInfoListener mDeviceInfoListener = new IDeviceInfoListener.Stub() {
        @Override
        public void onDeviceInfoChanged(Bundle clientInformation) throws RemoteException {
            if(callbackOnDeviceInfoChanged!=null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, BundleToJSONObject(clientInformation));
                result.setKeepCallback(true);
                callbackOnDeviceInfoChanged.sendPluginResult(result);
            }
        }
    };

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if("onDeviceInfoChanged".equals(action)) {
            callbackOnDeviceInfoChanged = callbackContext;
            callbackLocal = null;
            execlocal();
            return true;
        }else if("getMirrorLinkClientInformation".equals(action)) {
            callbackGetMirrorLinkClientInformation = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        callbackGetMirrorLinkClientInformation.success(BundleToJSONObject(mDeviceInfoManager.getMirrorLinkClientInformation()));
                    } catch (RemoteException e) {
                        e.printStackTrace();
                    }
                }
            };
            execlocal();
            return true;
        }else if("getServerVirtualKeyboardSupport".equals(action)) {
            callbackGetServerVirtualKeyboardSupport = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        callbackGetServerVirtualKeyboardSupport.success(BundleToJSONObject(mDeviceInfoManager.getServerVirtualKeyboardSupport()));
                    } catch (RemoteException e) {
                        e.printStackTrace();
                    }
                }
            };
            execlocal();
            return true;
        }else if("getMirrorLinkSessionVersionMajor".equals(action)) {
            callbackGetMirrorLinkSessionVersionMajor = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        callbackGetMirrorLinkSessionVersionMajor.success(mDeviceInfoManager.getMirrorLinkSessionVersionMajor());
                    } catch (RemoteException e) {
                        e.printStackTrace();
                    }
                }
            };
            execlocal();
            return true;
        }else if("getMirrorLinkSessionVersionMinor".equals(action)) {
            callbackGetMirrorLinkSessionVersionMinor = callbackContext;
            callbackLocal = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        callbackGetMirrorLinkSessionVersionMinor.success(mDeviceInfoManager.getMirrorLinkSessionVersionMinor());
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
        if (mDeviceInfoManager == null) {
            callbackBind = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        mDeviceInfoManager = mCommonAPI.getDeviceInfoManager(activity.getPackageName(), mDeviceInfoListener);
                        if(callbackLocal!=null) {
                            callbackLocal.callbackCall();
                        }
                    } catch (RemoteException e) {
                        mDeviceInfoManager = null;
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