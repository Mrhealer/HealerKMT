package com.kaity.dev.smarthome.VolleyLib;

import android.content.Context;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.kaity.dev.smarthome.Device.Model.DeviceModel;
import com.kaity.dev.smarthome.R;
import com.kaity.dev.smarthome.Utils.Constants;
import com.kaity.dev.smarthome.Utils.Logger;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class GetAllDeviceHelper {
    private static final String TAG = GetAllDeviceHelper.class.getSimpleName();

    public GetAllDeviceHelper(Context context) {
        VolleySingleton.getInstance(context).addToRequestQueue(stringRequest);
    }

    StringRequest stringRequest = new StringRequest(Request.Method.POST,Constants.URL_API_DEVICE, new Response.Listener<String>() {
        @Override
        public void onResponse(String response) {
            try {
                JSONObject jsonObject = new JSONObject(response);
                JSONArray jsonArray = jsonObject.getJSONArray("data");
                ArrayList<DeviceModel> arrayList = new ArrayList<>();
                for (int i = 0; i < jsonArray.length(); i++) {
                    String nameDevice = jsonArray.getJSONObject(i).optString("name");
                    arrayList.add(new DeviceModel(nameDevice, R.drawable.venha, ""));
                }
                Logger.i(TAG, "stringRequest", "onResponse " + arrayList);
            } catch (JSONException e) {
                Logger.e(TAG, "stringRequest", "JSONException " + e.toString());
            }
        }
    }, new Response.ErrorListener() {
        @Override
        public void onErrorResponse(VolleyError error) {
            Logger.i(TAG, "stringRequest", "onErrorResponse " + error.toString());
        }
    }){
        @Override
        protected Map<String, String> getParams() throws AuthFailureError {
            Map<String, String> params = new HashMap<>();
            params.put("name", "longkaka");
            params.put("content", "0000010");
            return params;
        }
    };


}
