package com.kaity.dev.smarthome.VolleyLib;

import android.content.Context;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.kaity.dev.smarthome.Utils.Constants;
import com.kaity.dev.smarthome.Utils.Logger;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class LoginHelper {
    private static final String TAG = LoginHelper.class.getSimpleName();
    private static final String USERNAME_KEY = "username";
    private static final String PASSWORD_KEY = "password";
    private Context mContext;
    private onLoginCallBack mOnLoginCallBack;
    private String mUserName, mPassword;

    public interface onLoginCallBack {
        void onLoginSuccess();
    }

    public LoginHelper(Context context, String userName, String passWord, onLoginCallBack onLoginCallBack) {
        this.mContext = context;
        this.mUserName = userName;
        this.mPassword = passWord;
        this.mOnLoginCallBack = onLoginCallBack;
        VolleySingleton.getInstance(mContext).addToRequestQueue(stringRequest);
    }

    StringRequest stringRequest = new StringRequest(Request.Method.POST, Constants.URL_API_LOGIN, new Response.Listener<String>() {
        @Override
        public void onResponse(String response) {
            try {
                Logger.i(TAG, "stringRequest", "success " + response);
                JSONObject jsonObject = new JSONObject(response);
                boolean isLoginSuccess = Boolean.parseBoolean(jsonObject.optString("success"));
                Logger.i(TAG, "stringRequest", "success: " + isLoginSuccess);
                if (isLoginSuccess) {
                    mOnLoginCallBack.onLoginSuccess();
                } else {
                    Logger.i(TAG, "Bạn đã Đăng nhập UserName or Password", "");
                }

            } catch (JSONException e) {
                Logger.e(TAG, "JSONException", "");
            }
        }
    }, new Response.ErrorListener() {
        @Override
        public void onErrorResponse(VolleyError error) {
            Logger.i(TAG, "stringRequest", "onErrorResponse " + error.toString());
        }
    }) {
        @Override
        protected Map<String, String> getParams() throws AuthFailureError {
            Map<String, String> params = new HashMap<>();
            params.put(USERNAME_KEY, mUserName);
            params.put(PASSWORD_KEY, mPassword);
            return params;
        }
    };

}
