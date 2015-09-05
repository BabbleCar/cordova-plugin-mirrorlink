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

        if(!isconnected) {
            callbackContext.error("service is not connected");
            return false;
        }

        if("onCertificationStatusChanged".equals(action)) {
            callbackOnCertificationStatusChanged = callbackContext;
            getCertificationManager();
        //4.3.1 return bundle
        } else if("getApplicationCertificationStatus".equals(action)){
            try {
                callbackContext.success(BundleToJSONObject(getCertificationManager().getApplicationCertificationStatus()));
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        //4.3.2 return string
        } else if("getApplicationCertifyingEntities".equals(action)){
            try {
                callbackContext.success(getCertificationManager().getApplicationCertifyingEntities());
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        //4.3.3 return bundle
        } else if("getApplicationCertificationInformation".equals(action)){
            String entity = args.getString(0);
            try {
                callbackContext.success(BundleToJSONObject(getCertificationManager().getApplicationCertificationInformation(entity)));
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }  else if("unregister".equals(action)) {
            try {
                getCertificationManager().unregister();
                callbackContext.success();
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }else {
            callbackContext.error("AlertPlugin." + action + " not found !");
            return false;
        }

        return true;
    }

    private ICertificationManager getCertificationManager() {
        if (mCertificationManager == null) {
            try {
                mCertificationManager = mCommonAPI.getCertificationManager(activity.getPackageName(), mCertificationListener);
            } catch (RemoteException e) {
                mCertificationManager = null;
            }
        }

        return mCertificationManager;
    }
}