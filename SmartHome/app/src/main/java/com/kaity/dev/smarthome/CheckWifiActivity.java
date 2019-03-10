package com.kaity.dev.smarthome;

import android.animation.Animator;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.kaity.dev.smarthome.DashBoard.HomeActivity;
import com.kaity.dev.smarthome.Utils.Logger;
import com.kaity.dev.smarthome.Utils.Ripple;
import com.kaity.dev.smarthome.VolleyLib.VolleySingleton;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.w3c.dom.Text;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

public class CheckWifiActivity extends AppCompatActivity {

    private static final String TAG = CheckWifiActivity.class.getSimpleName();
    private static final String NAME_WIFI_DEFAULT = "Healer 402";
    private static final String WIFI_KEY = "\"1234567899\"";
    private TextView mTextConfigure;
    private ImageView mImageRipple;
    private Ripple ripple;
    private EditText mEdt_NameWF, mEdt_PasswordWF;
    private String mUrl;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_check_wifi_layout);
        Toolbar toolbar = findViewById(R.id.toolbar_wifi);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setDisplayShowHomeEnabled(true);
            getSupportActionBar().setDisplayShowTitleEnabled(false);
        }
        ripple = (Ripple) findViewById(R.id.content_Ripple);
        mEdt_NameWF = findViewById(R.id.edt_Name_Wifi);
        mEdt_PasswordWF = findViewById(R.id.edt_Password_Wifi);
        final Handler handler = new Handler();
        mImageRipple = findViewById(R.id.centerImage);
        mTextConfigure = findViewById(R.id.tv_Configure);
        mTextConfigure.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ripple.startRippleAnimation();
                String name = mEdt_NameWF.getText().toString().trim();
                String password = mEdt_PasswordWF.getText().toString().trim();
                mUrl = "http://192.168.4.1/setting?ssid=" + name + "&pass=" + password + "&link=192.168.1.2";
//                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
//                    startActivity(intent);
                searchSSID(getApplicationContext(), NAME_WIFI_DEFAULT, WIFI_KEY);
                handler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        foundDevice();
                    }
                }, 5000);

            }
        });
    }

    private void searchSSID(Context context, String ssid, String password) {
        WifiManager wifiManager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
        if (!wifiManager.isWifiEnabled()) {
            wifiManager.setWifiEnabled(true);
        }

        WifiConfiguration conf = new WifiConfiguration();
        conf.SSID = String.format("\"%s\"", ssid);
        conf.preSharedKey = password;
        conf.hiddenSSID = true;
        conf.status = WifiConfiguration.Status.ENABLED;
        conf.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.TKIP);
        conf.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.CCMP);
        conf.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.WPA_PSK);
        conf.allowedPairwiseCiphers.set(WifiConfiguration.PairwiseCipher.TKIP);
        conf.allowedPairwiseCiphers.set(WifiConfiguration.PairwiseCipher.CCMP);
        conf.allowedProtocols.set(WifiConfiguration.Protocol.RSN);
        int netId = wifiManager.addNetwork(conf);
        boolean b = wifiManager.enableNetwork(netId, true);
        if (b) {
            VolleySingleton.getInstance(getApplicationContext()).addToRequestQueue(stringRequest);
        } else {
            Toast.makeText(getApplicationContext(), "Không thể connect SmartHome", Toast.LENGTH_LONG).show();
        }
        Logger.i(TAG, "searchSSID", "ssid: " + conf.SSID + " connect : " + b);
    }

    private String getWifiSSID(Context context) {
        if (context == null) {
            return "";
        }
        String ssid = null;
        WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        if (wifiManager != null) {
            WifiInfo wifiInfo = wifiManager.getConnectionInfo();
            if (wifiInfo != null) {
                ssid = wifiInfo.getSSID();
                if (ssid != null) {
                    return ssid;
                }
            }
        }

        Logger.i(TAG, "getWifiSSID", "ssid: " + ssid);
        return "";
    }

    StringRequest stringRequest = new StringRequest(Request.Method.GET, mUrl, new Response.Listener<String>() {
        @Override
        public void onResponse(String response) {
            try {
                Object data = new JSONTokener(response);
                if (data instanceof JSONObject) {
                    JSONObject jsonObject = new JSONObject(response);
                    String result = jsonObject.optString("setupwifi");
                    if ("ok".equalsIgnoreCase(result)) {
                        Toast.makeText(getApplicationContext(), "Setup Ok", Toast.LENGTH_LONG).show();
                        Intent intent = new Intent(CheckWifiActivity.this, HomeActivity.class);
                        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                        startActivity(intent);
                    } else {
                        Toast.makeText(getApplicationContext(), "Setup không thành công", Toast.LENGTH_LONG).show();
                    }


                } else {
                    Toast.makeText(getApplicationContext(), "Dữ Liệu Trả về là Array", Toast.LENGTH_LONG).show();
                }
            } catch (JSONException e) {
                Logger.i(TAG, "stringRequest", "JSONException: ");
            }
        }
    }, new Response.ErrorListener() {
        @Override
        public void onErrorResponse(VolleyError error) {
            Logger.e(TAG, "onErrorResponse", "VolleyError");
        }
    });


    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return super.onSupportNavigateUp();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.action_wifi_settings, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            finish();
        }
        return super.onOptionsItemSelected(item);
    }

    private void foundDevice() {
        AnimatorSet animatorSet = new AnimatorSet();
        animatorSet.setDuration(500);
        animatorSet.setInterpolator(new AccelerateDecelerateInterpolator());
        ArrayList<Animator> animatorList = new ArrayList<Animator>();
        ObjectAnimator scaleXAnimator = ObjectAnimator.ofFloat(mImageRipple, "ScaleX", 0f, 1.2f, 1f);
        animatorList.add(scaleXAnimator);
        ObjectAnimator scaleYAnimator = ObjectAnimator.ofFloat(mImageRipple, "ScaleY", 0f, 1.2f, 1f);
        animatorList.add(scaleYAnimator);
        animatorSet.playTogether(animatorList);
        mImageRipple.setVisibility(View.VISIBLE);
        ripple.stopRippleAnimation();
        animatorSet.start();
    }

}
