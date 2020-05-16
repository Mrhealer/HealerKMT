package com.kaity.dev.smarthome.VolleyLib;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.util.Base64;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.kaity.dev.smarthome.DashBoard.HomeActivity;
import com.kaity.dev.smarthome.Utils.Constants;
import com.kaity.dev.smarthome.Utils.Logger;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;

public class AddDeviceHelper {
    private static final String TAG = AddDeviceHelper.class.getSimpleName();
    private static final String ID_INDEX = "id";
    private static final String CODE_INDEX = "code";
    private static final String NAME_DEVICE_DEFAULT = "name";
    private static final String CONTENT_STATUS = "content";
    private static final String CATEGORY_INDEX = "category";
    private static final String USER_ID = "userId";
    private Context mContext;
    private Bitmap mBitpmap;
    private String mIdDevice, mCodeIndex, mNameDevice, mContentDevice, mCateGoryDevice;


    public AddDeviceHelper(Context context, Bitmap bitmap, String idIndex, String codeIndex, String nameDevice, String contentDevice, String categoryDevice) {
        this.mContext = context;
        this.mBitpmap = bitmap;
        this.mIdDevice = idIndex;
        this.mCodeIndex = codeIndex;
        this.mNameDevice = nameDevice;
        this.mContentDevice = contentDevice;
        this.mCateGoryDevice = categoryDevice;
        VolleySingleton.getInstance(context).addToRequestQueue(stringRequest);
    }

    StringRequest stringRequest = new StringRequest(Request.Method.POST, Constants.URL_API_ADD_DEVICE, new Response.Listener<String>() {
        @Override
        public void onResponse(String response) {
            Toast.makeText(mContext, "Update Success", Toast.LENGTH_LONG).show();
            Intent intent = new Intent(mContext, HomeActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            mContext.startActivity(intent);
        }
    }, new Response.ErrorListener() {
        @Override
        public void onErrorResponse(VolleyError error) {
            Logger.i(TAG, "stringRequest", "onErrorResponse");
        }
    }) {
        @Override
        protected Map<String, String> getParams() throws AuthFailureError {
            // Converting Bitmap to String
//            String image = getStringImage(mBitpmap);

            //Getting Image Name
            Map<String, String> params = new Hashtable<>();
            params.put(ID_INDEX, mIdDevice);
            params.put(CODE_INDEX, mCodeIndex);
            params.put(NAME_DEVICE_DEFAULT, mNameDevice);
            params.put(CONTENT_STATUS, mContentDevice);
            params.put(CATEGORY_INDEX, mCateGoryDevice);
            params.put(USER_ID, Constants.USER_ID);
            return params;
        }
    };

    private String getStringImage(Bitmap bmp) {
        ByteArrayOutputStream bAOS = new ByteArrayOutputStream();
        bmp.compress(Bitmap.CompressFormat.JPEG, 100, bAOS);
        byte[] imageBytes = bAOS.toByteArray();
        String encodedImage = Base64.encodeToString(imageBytes, Base64.DEFAULT);
        return encodedImage;
    }
}
