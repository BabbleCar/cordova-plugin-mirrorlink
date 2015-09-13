package com.babblecar.mirrorlink;

import android.app.Activity;
import android.os.Bundle;

import com.mirrorlink.android.commonapi.ICommonAPIService;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

abstract public class AbstractMirrorLinkPlugin extends CordovaPlugin {
    protected static volatile ICommonAPIService mCommonAPI = null;
    protected static boolean isconnected = false;
    protected Activity activity = null;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        activity = cordova.getActivity();
    }

    protected JSONObject BundleToJSONObject(Bundle b) {
        JSONObject j = new JSONObject();

        if(b!=null) {
            Set<String> keys = b.keySet();
            for (String key : keys) {
                try {
                    Object obj = b.get(key);
                    if (obj instanceof Bundle) {
                        j.put(key, this.BundleToJSONObject((Bundle) obj));
                    } else {
                        j.put(key, obj);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }

        return j;
    }

    protected JSONArray ListBundleToJSONArray(List<Bundle> lb) {
        JSONArray ja = new JSONArray();
        for (Bundle b : lb ) {
            ja.put(BundleToJSONObject(b));
        }
        return ja;
    }

    protected Bundle JSONObjectToBundle(JSONObject jo) {
        Bundle bf = new Bundle();
        Iterator<String> item;
        item = jo.keys();
        while (item.hasNext()) {
            String key = item.next();
            try {
                Object obj = jo.get(key);
                if(obj instanceof JSONObject) {
                    bf.putBundle(key, this.JSONObjectToBundle((JSONObject) obj));
                } else if (obj instanceof String) {
                    bf.putString(key, (String) obj);
                } else if (obj instanceof Integer) {
                    bf.putInt(key, (Integer) obj);
                }
            } catch (JSONException ignored) {}
        }

        return bf;
    }

    protected List<Bundle> JSONArrayToListBundle(JSONArray ja) {
        List<Bundle> lb = new ArrayList<Bundle>();
        for(int n = 0; n < ja.length(); n++)
            try {
                Object obj = ja.get(n);
                if (obj instanceof JSONObject) {
                    lb.add(this.JSONObjectToBundle((JSONObject) obj));
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }

        return lb;
    }
}