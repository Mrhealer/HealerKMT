package com.kaity.dev.smarthome.Utils;

import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiManager;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.kaity.dev.smarthome.CheckWifiActivity;
import com.kaity.dev.smarthome.DashBoard.HomeActivity;
import com.kaity.dev.smarthome.Database.DatabaseHelper;
import com.kaity.dev.smarthome.SmartHomeApplication;
import com.kaity.dev.smarthome.VolleyLib.VolleySingleton;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;

import java.io.IOException;

import io.socket.client.Socket;

public class CommonUtils {
    private static final String TAG = CommonUtils.class.getSimpleName();
    private static final String LANGUAGE_TABLE_NAME = "language";
    private static final String LANGUAGE_CULUMNNNAME = "value";
    public static final String mPreference = "mPreferenceUserID";

    /**
     * get status of Network
     *
     * @param context
     * @return
     */

    public boolean isStatusNetwork(Context context) {
        if (context != null) {
            ConnectivityManager con = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
            if (con != null) {
                NetworkInfo networkInfo = con.getActiveNetworkInfo();
                if (networkInfo != null && networkInfo.isConnected()) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * get language default language from database
     *
     * @param databaseHelper
     * @param context
     * @return
     */
    public int getLanguage(DatabaseHelper databaseHelper, Context context) {
        databaseHelper = new DatabaseHelper(context);
        int languageIndex = 0;
        try {
            databaseHelper.createDataBase();
            databaseHelper.openDataBase();
        } catch (IOException e) {
            Logger.e(TAG, "getLanguage", "IOException");
        }

        SQLiteDatabase sd = databaseHelper.getReadableDatabase();
        Cursor cursor = sd.query(LANGUAGE_TABLE_NAME, null, null, null, null, null, null);
        try {
            if (cursor != null && cursor.moveToNext()) {
                languageIndex = Integer.parseInt(cursor.getString(cursor.getColumnIndex(LANGUAGE_CULUMNNNAME)));
                Logger.i(TAG, "getLanguage", "languageIndex : " + languageIndex);
            }
        } catch (Exception e) {
            Logger.e(TAG, "getLanguage", "Exception");
        } finally {
            if (cursor != null) {
                cursor.close();
            }
        }
        return languageIndex;
    }

    /**
     * handle set value language to Database
     *
     * @param context
     */
    public void setLanguageToDatabase(DatabaseHelper databaseHelper, Context context, int index) {
        if (context != null) {
            Logger.i(TAG, "setLanguageToDatabase", "index : " + index);
            databaseHelper = new DatabaseHelper(context);
            try {
                databaseHelper.createDataBase();
                databaseHelper.openDataBase();
            } catch (IOException e) {
                e.printStackTrace();
            }
            SQLiteDatabase sd = databaseHelper.getWritableDatabase();
            ContentValues values = new ContentValues();
            values.put(LANGUAGE_CULUMNNNAME, index);
            sd.update(LANGUAGE_TABLE_NAME, values, LANGUAGE_CULUMNNNAME + " = ?", new String[]{String.valueOf(index)});
        } else {
            Logger.w(TAG, "setLanguageToDatabase", "Context null");
        }
    }

    public static void connectSocket(Socket socket){


    }
}
