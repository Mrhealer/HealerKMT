package com.kaity.dev.smarthome.VolleyLib;

import android.content.Context;
import android.graphics.Bitmap;
import android.util.Base64;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.kaity.dev.smarthome.Utils.Constants;
import com.kaity.dev.smarthome.Utils.Logger;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;

public class AddDeviceHelper {
    private static final String TAG = AddDeviceHelper.class.getSimpleName();
    private static final String ID_INDEX = "id";
    private static final String ID_DEVICE_INDEX = "";
    private static final String NAME_DEVICE_DEFAULT = "";
    private static final String TYPE_DEVICE_DEFAULT = "";
    private static final String CONTENT_DEVICE = "";
    private Context mContext;
    private Bitmap mBitpmap;
    private String mId, mID_Device, mName_Device, mContent_Device, mType_Device;


    public AddDeviceHelper(Context context, Bitmap bitmap, String id, String id_device, String name_Device, String content_Device, String type_Device) {
        this.mContext = context;
        this.mBitpmap = bitmap;
        this.mId = id;
        this.mID_Device = id_device;
        this.mName_Device = name_Device;
        this.mContent_Device = content_Device;
        this.mType_Device = type_Device;
        VolleySingleton.getInstance(context).addToRequestQueue(stringRequest);
    }

    StringRequest stringRequest = new StringRequest(Request.Method.POST, Constants.URL_API_DEVICE, new Response.Listener<String>() {
        @Override
        public void onResponse(String response) {

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
            String image = getStringImage(mBitpmap);

            //Getting Image Name
            Map<String, String> params = new Hashtable<>();
            params.put(ID_INDEX, mId);
            return super.getParams();
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
