package com.kaity.dev.smarthome;

import android.animation.Animator;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.text.TextUtils;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.kaity.dev.smarthome.DashBoard.HomeActivity;
import com.kaity.dev.smarthome.Utils.Logger;
import com.kaity.dev.smarthome.Utils.Ripple;
import com.kaity.dev.smarthome.VolleyLib.VolleySingleton;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class CheckWifiActivity extends AppCompatActivity {

    private static final String TAG = CheckWifiActivity.class.getSimpleName();
    private static final String NAME_WIFI_DEFAULT = "SMARTHOME";
    private static final String WIFI_KEY = "1234567899";
    private static final String KEY_RESULT_DEFAULT = "setupwifi";
    private static final String COMPONENT_SETTINGS = "com.android.settings";
    private static final String COMPONENT_WIFI_SETTINGS = "com.android.settings.wifi.WifiSettings";
    private static final int DELAY_INDEX = 5000;
    private TextView mTextConfigure;
    private ImageView mImageRipple;
    private Ripple ripple;
    private EditText mEdt_NameWF, mEdt_PasswordWF;
    private String mUrl;
    private boolean mIsRequest = false;

    private BroadcastReceiver mReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            ConnectivityManager connMgr = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
            if (connMgr != null) {
                NetworkInfo wifi = connMgr.getNetworkInfo(ConnectivityManager.TYPE_WIFI);
                if (wifi.isConnected()) {
                    if (checkWifiSSID(context)) {
                        if (mIsRequest) {
                            Logger.w(TAG, "mReceiver", "Url: " + mUrl);
                            VolleySingleton.getInstance(context).addToRequestQueue(stringRequest);
                        }
                    } else {
                        Logger.w(TAG, "mReceiver", "SSID SMARTHOME not correct");
                    }
                } else {
                    Logger.w(TAG, "mReceiver", "isConnected not connected ");
                }
            } else {
                Logger.w(TAG, "mReceiver", "ConnectivityManager null ");
            }

        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_check_wifi_layout);
        Toolbar toolbar = findViewById(R.id.toolbar_wifi);
        mIsRequest = false;
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
                String name = mEdt_NameWF.getText().toString().trim();
                String password = mEdt_PasswordWF.getText().toString().trim();
                if (TextUtils.isEmpty(name) || TextUtils.isEmpty(password)) {
                    Toast.makeText(getApplicationContext(), getString(R.string.message_input_wifi), Toast.LENGTH_LONG).show();
                } else {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        Intent intent = new Intent(Intent.ACTION_VIEW, null);
                        intent.addCategory(Intent.CATEGORY_LAUNCHER);
                        ComponentName componentName = new ComponentName(COMPONENT_SETTINGS, COMPONENT_WIFI_SETTINGS);
                        intent.setComponent(componentName);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                    } else {
                        ripple.startRippleAnimation();
                        mIsRequest = true;
                        mUrl = "http://192.168.4.1/setting?ssid=" + name + "&pass=" + password + "&link=192.168.1.2";
                        setPreSharedKey(getApplicationContext(), NAME_WIFI_DEFAULT, WIFI_KEY);
                        handler.postDelayed(new Runnable() {
                            @Override
                            public void run() {
                                foundDevice();
                            }
                        }, DELAY_INDEX);
                    }
                }
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        registerReceiver(mReceiver, new IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION));
    }

    @Override
    protected void onDestroy() {
        mIsRequest = false;
        if (mReceiver != null) {
            unregisterReceiver(mReceiver);
        }
        super.onDestroy();
    }

    private void setPreSharedKey(Context context, String ssid, String password) {
        if (context != null) {
            WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
            if (wifiManager != null) {
                if (!wifiManager.isWifiEnabled()) {
                    wifiManager.setWifiEnabled(true);
                }

                WifiConfiguration conf = new WifiConfiguration();
                conf.SSID = String.format("\"%s\"", ssid);
                conf.preSharedKey = String.format("\"%s\"", password);
                conf.hiddenSSID = true;
                conf.status = WifiConfiguration.Status.ENABLED;
                conf.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.TKIP);
                conf.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.CCMP);
                conf.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.WPA_PSK);
                conf.allowedPairwiseCiphers.set(WifiConfiguration.PairwiseCipher.TKIP);
                conf.allowedPairwiseCiphers.set(WifiConfiguration.PairwiseCipher.CCMP);
                conf.allowedProtocols.set(WifiConfiguration.Protocol.RSN);
                int netId = wifiManager.addNetwork(conf);
                wifiManager.saveConfiguration();
                wifiManager.disconnect();
                wifiManager.enableNetwork(netId, true);
                wifiManager.reconnect();
                Logger.i(TAG, "setPreSharedKey", "ssid: " + conf.SSID);
            } else {
                Logger.w(TAG, "setPreSharedKey", "wifiManager null ");
            }

        } else {
            Logger.w(TAG, "setPreSharedKey", "Context null ");
        }
    }

    private static boolean checkWifiSSID(Context context) {
        if (context == null) {
            return false;
        }
        String ssid = null;
        WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        if (wifiManager != null) {
            WifiInfo wifiInfo = wifiManager.getConnectionInfo();
            if (wifiInfo != null) {
                ssid = wifiInfo.getSSID();
                String ssidDefault = String.format("\"%s\"", NAME_WIFI_DEFAULT);
                if (ssidDefault.equalsIgnoreCase(ssid)) {
                    return true;
                }
            }
        }

        Logger.i(TAG, "getWifiSSID", "ssid: " + ssid);
        return false;
    }

    StringRequest stringRequest = new StringRequest(mUrl, new Response.Listener<String>() {
        @Override
        public void onResponse(String response) {
            try {
                JSONObject jsonObject = new JSONObject(response);
                String result = jsonObject.optString(KEY_RESULT_DEFAULT);
                if ("ok".equalsIgnoreCase(result)) {
                    Intent intent = new Intent(CheckWifiActivity.this, HomeActivity.class);
                    intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    startActivity(intent);
                } else {
                    Logger.w(TAG, "stringRequest", "Setup Error");
                }
            } catch (JSONException e) {
                Logger.e(TAG, "stringRequest", "JSONException: ");
            }
        }
    }, new Response.ErrorListener() {
        @Override
        public void onErrorResponse(VolleyError error) {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(mUrl));
            startActivity(intent);
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
