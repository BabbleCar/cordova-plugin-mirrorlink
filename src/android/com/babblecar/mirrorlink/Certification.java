package com.babblecar.mirrorlink;

import android.os.RemoteException;

import com.mirrorlink.android.commonapi.ICertificationListener;
import com.mirrorlink.android.commonapi.ICertificationManager;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

public class Certification extends AbstractMirrorLinkPlugin {
    private volatile ICertificationManager mCertificationManager = null;

    private CallbackContext callbackOnCertificationStatusChanged = null;
    private CallbackContext callbackGetApplicationCertificationInformation = null;
    private CallbackContext callbackGetApplicationCertificationStatus = null;
    private CallbackContext callbackGetApplicationCertifyingEntities = null;
    private CallbackContext callbackUnregister = null;

    private final ICertificationListener mCertificationListener = new ICertificationListener.Stub() {
        @Override
        public void onCertificationStatusChanged() throws RemoteException {
            if(callbackOnCertificationStatusChanged!=null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK);
                result.setKeepCallback(true);
                callbackOnCertificationStatusChanged.sendPluginResult(result);
            }
        }
    };

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        callbackLocal = null;
        switch (action) {
            case "onCertificationStatusChanged" :
                callbackOnCertificationStatusChanged = callbackContext;
                break;
            case "getApplicationCertificationInformation" :
                callbackGetApplicationCertificationInformation = callbackContext;
                callbackLocal = new MirrorLinkCallback()  {
                    @Override
                    public void callbackCall() {
                        try {
                            String entity = args.getString(0);
                            callbackGetApplicationCertificationInformation.success(BundleToJSONObject(mCertificationManager.getApplicationCertificationInformation(entity)));
                        } catch (RemoteException e) {
                            e.printStackTrace();
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                };
                break;
            case "getApplicationCertificationStatus" :
                callbackGetApplicationCertificationStatus = callbackContext;
                callbackLocal = new MirrorLinkCallback()  {
                    @Override
                    public void callbackCall() {
                        try {
                            callbackGetApplicationCertificationStatus.success(BundleToJSONObject(mCertificationManager.getApplicationCertificationStatus()));
                        } catch (RemoteException e) {
                            e.printStackTrace();
                        }
                    }
                };
                break;
            case "getApplicationCertifyingEntities" :
                callbackGetApplicationCertifyingEntities = callbackContext;
                callbackLocal = new MirrorLinkCallback()  {
                    @Override
                    public void callbackCall() {
                        try {
                            callbackGetApplicationCertifyingEntities.success(mCertificationManager.getApplicationCertifyingEntities());
                        } catch (RemoteException e) {
                            e.printStackTrace();
                        }
                    }
                };
                break;
            case "unregister" :
                callbackUnregister = callbackContext;
                callbackLocal = new MirrorLinkCallback()  {
                    @Override
                    public void callbackCall() {
                        try {
                            mCertificationManager.unregister();
                            callbackUnregister.success();
                        } catch (RemoteException e) {
                            e.printStackTrace();
                        }
                    }
                };
                break;
            default:
                callbackContext.error("AlertPlugin." + action + " not found !");
                return false;
        }

        execlocal();

        return true;
    }

    protected void execlocal() {
        if (mCertificationManager == null) {
            callbackBind = new MirrorLinkCallback()  {
                @Override
                public void callbackCall() {
                    try {
                        mCertificationManager = mCommonAPI.getCertificationManager(activity.getPackageName(), mCertificationListener);
                        if(callbackLocal!=null) {
                            callbackLocal.callbackCall();
                        }
                    } catch (RemoteException e) {
                        mCertificationManager = null;
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