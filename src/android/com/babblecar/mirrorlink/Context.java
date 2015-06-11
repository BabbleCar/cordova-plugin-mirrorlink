package com.babblecar.mirrorlink;

import android.os.Bundle;
import android.os.RemoteException;
import com.mirrorlink.android.commonapi.IContextListener;
import com.mirrorlink.android.commonapi.IContextManager;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.ArrayList;

public class Context extends AbstractMirrorLinkPlugin {

    private volatile IContextManager mContextManager = null;

    private CallbackContext callbackOnFramebufferBlocked = null;
    private CallbackContext callbackOnAudioBlocked = null;
    private CallbackContext callbackOnFramebufferUnblocked = null;
    private CallbackContext callbackOnAudioUnblocked = null;

    private final IContextListener mContextListener = new IContextListener.Stub() {
        @Override
        public void onFramebufferBlocked(int reason, Bundle framebufferArea) throws RemoteException {
            if(callbackOnFramebufferBlocked!=null) {
                JSONObject j = new JSONObject();
                try {
                    j.put("reason", reason);
                    j.put("framebufferArea", BundleToJSONObject(framebufferArea));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                PluginResult result = new PluginResult(PluginResult.Status.OK,j);
                result.setKeepCallback(true);
                callbackOnFramebufferBlocked.sendPluginResult(result);
            }
        }
        @Override
        public void onAudioBlocked(int reason) throws RemoteException {
            if(callbackOnAudioBlocked!=null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK,reason);
                result.setKeepCallback(true);
                callbackOnAudioBlocked.sendPluginResult(result);
            }
        }
        @Override
        public void onFramebufferUnblocked() throws RemoteException {
            if(callbackOnFramebufferUnblocked!=null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK,true);
                result.setKeepCallback(true);
                callbackOnFramebufferUnblocked.sendPluginResult(result);
            }
        }
        @Override
        public void onAudioUnblocked() throws RemoteException {
            if(callbackOnAudioUnblocked!=null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK,true);
                result.setKeepCallback(true);
                callbackOnAudioUnblocked.sendPluginResult(result);
            }
        }
    };

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        callbackLocal = null;

        switch (action) {
            case "onFramebufferBlocked" :
                callbackOnFramebufferBlocked = callbackContext;
                break;
            case "onAudioBlocked" :
                callbackOnAudioBlocked = callbackContext;
                break;
            case "onFramebufferUnblocked" :
                callbackOnFramebufferUnblocked = callbackContext;
                break;
            case "onAudioUnblocked" :
                callbackOnAudioUnblocked = callbackContext;
                break;
            case "setAudioContextInformation" :
                try {
                    Boolean AudioContent = args.getBoolean(0);
                    JSONArray jAudioCategories =  args.getJSONArray(1);
                    Boolean HandleBlocking = args.getBoolean(2);
                    int audioCategories[] = new int[jAudioCategories.length()];
                    for(int i = 0 ; i < jAudioCategories.length(); i++){
                        audioCategories[i] = jAudioCategories.getInt(i);
                    }
                    getContextManager().setAudioContextInformation(AudioContent,audioCategories,HandleBlocking);
                    callbackContext.success();
                } catch (RemoteException | JSONException e) {
                    e.printStackTrace();
                }
                break;
            case "setFramebufferContextInformation" :
                try {
                    //TODO jContent voir spéc pour setter
                    //JSONObject jContent = args.getJSONObject(0);
                    Boolean HandleBlocking = args.getBoolean(1);

                    ArrayList<Bundle> content = new ArrayList<>();
                    getContextManager().setFramebufferContextInformation(content, HandleBlocking);

                    callbackContext.success();
                } catch (RemoteException | JSONException e) {
                    e.printStackTrace();
                }
                break;
            case "unregister" :
                try {
                    getContextManager().unregister();
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

    protected IContextManager getContextManager() {
        if (mContextManager == null) {
            try {
                mContextManager = mCommonAPI.getContextManager(activity.getPackageName(), mContextListener);
            } catch (RemoteException e) {
                mContextManager = null;
            }
        }

        return mContextManager;
    }
}
