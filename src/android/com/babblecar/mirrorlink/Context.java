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

import java.util.List;

public class Context extends AbstractMirrorLinkPlugin {

    private volatile IContextManager mContextManager = null;

    private CallbackContext callbackOnFramebufferBlocked = null;
    private CallbackContext callbackOnAudioBlocked = null;
    private CallbackContext callbackOnFramebufferUnblocked = null;
    private CallbackContext callbackOnAudioUnblocked = null;

    private final IContextListener mContextListener = new IContextListener.Stub() {
        @Override
        public void onFramebufferBlocked(int reason, Bundle framebufferArea) throws RemoteException {
            if (callbackOnFramebufferBlocked != null) {
                JSONObject j = new JSONObject();
                try {
                    j.put("reason", reason);
                    j.put("framebufferArea", BundleToJSONObject(framebufferArea));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                PluginResult result = new PluginResult(PluginResult.Status.OK, j);
                result.setKeepCallback(true);
                callbackOnFramebufferBlocked.sendPluginResult(result);
            }
        }

        @Override
        public void onAudioBlocked(int reason) throws RemoteException {
            if (callbackOnAudioBlocked != null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, reason);
                result.setKeepCallback(true);
                callbackOnAudioBlocked.sendPluginResult(result);
            }
        }

        @Override
        public void onFramebufferUnblocked() throws RemoteException {
            if (callbackOnFramebufferUnblocked != null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, true);
                result.setKeepCallback(true);
                callbackOnFramebufferUnblocked.sendPluginResult(result);
            }
        }

        @Override
        public void onAudioUnblocked() throws RemoteException {
            if (callbackOnAudioUnblocked != null) {
                PluginResult result = new PluginResult(PluginResult.Status.OK, true);
                result.setKeepCallback(true);
                callbackOnAudioUnblocked.sendPluginResult(result);
            }
        }
    };

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        if (!isconnected) {
            callbackContext.error("service is not connected");
            return false;
        }

        // 4.9.1 IN (int reason, Bundle framebufferArea)
        if ("setFramebufferContextInformation".equals(action)) try {

                /*
                content param :
                [
                    {
                        "APPLICATION_CATEGORY" : "<string>",
                        "CONTENT_CATEGORY" : "<string>",
                        "RECT" : {
                            "WIDTH" <int>,
                            "HEIGHT" <int>,
                            "X" <int>,
                            "Y" <int>
                        }
                    },...
                ]
                 */
            Boolean HandleBlocking = args.getBoolean(1);
            List<Bundle> content = this.JSONArrayToListBundle(args.getJSONArray(0));
            getContextManager().setFramebufferContextInformation(content, HandleBlocking);
            callbackContext.success();
        } catch (RemoteException e) {
            e.printStackTrace();
        }
            // 4.9.2
        else if ("onFramebufferBlocked".equals(action)) {
            callbackOnFramebufferBlocked = callbackContext;
            getContextManager();
            // 4.9.3
        } else if ("setAudioContextInformation".equals(action)) {
            try {
                Boolean AudioContent = args.getBoolean(0);
                JSONArray jAudioCategories = args.getJSONArray(1);
                Boolean HandleBlocking = args.getBoolean(2);
                int audioCategories[] = new int[jAudioCategories.length()];
                for (int i = 0; i < jAudioCategories.length(); i++) {
                    audioCategories[i] = jAudioCategories.getInt(i);
                }
                getContextManager().setAudioContextInformation(AudioContent, audioCategories, HandleBlocking);
                callbackContext.success();
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            // 4.9.4
        } else if ("onAudioBlocked".equals(action)) {
            callbackOnAudioBlocked = callbackContext;
            getContextManager();
            // 4.9.5
        } else if ("onFramebufferUnblocked".equals(action)) {
            callbackOnFramebufferUnblocked = callbackContext;
            getContextManager();
            // 4.9.6
        } else if ("onAudioUnblocked".equals(action)) {
            callbackOnAudioUnblocked = callbackContext;
            getContextManager();
        } else if ("unregister".equals(action)) {
            try {
                getContextManager().unregister();
                callbackContext.success();
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        } else {
            callbackContext.error("AlertPlugin. " + action + " not found !");
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
