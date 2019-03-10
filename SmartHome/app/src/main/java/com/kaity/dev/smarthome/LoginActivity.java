package com.kaity.dev.smarthome;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.Configuration;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.hardware.fingerprint.FingerprintManager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.kaity.dev.smarthome.Database.DatabaseHelper;
import com.kaity.dev.smarthome.Utils.Logger;
import com.kaity.dev.smarthome.VolleyLib.LoginHelper;

import java.util.Locale;

public class LoginActivity extends AppCompatActivity {
    private static final String TAG = LoginActivity.class.getSimpleName();
    Button btn_login;
    private TextView mTextChooseLanguage;
    private DatabaseHelper mDatabaseHelper;
    private EditText mEdtUserName, mEdtPassword;
//    private FingerPrintAuthHelper mFingerPrintAuthHelper;
    private LoginHelper.onLoginCallBack mOnLoginCallBack;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_login_layout);
        init();
//        mFingerPrintAuthHelper = FingerPrintAuthHelper.getHelper(this, this);
    }

    @Override
    protected void onResume() {
        super.onResume();
//        mFingerPrintAuthHelper.startAuth();
    }

    @Override
    protected void onPause() {
        super.onPause();
//        mFingerPrintAuthHelper.stopAuth();
    }

    private void init() {
        Logger.i(TAG, "init", "");
        mTextChooseLanguage = findViewById(R.id.tv_Choose_Language);
        mEdtUserName = findViewById(R.id.edt_UserName);
        mEdtPassword = findViewById(R.id.edt_Password);
        btn_login = findViewById(R.id.btn_Login);
        mOnLoginCallBack = new LoginHelper.onLoginCallBack() {
            @Override
            public void onLoginSuccess() {
                Logger.i(TAG, "init", "onLoginSuccess");
                Intent intent = new Intent(LoginActivity.this, DashBoardActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                startActivity(intent);
            }
        };
        mTextChooseLanguage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                displayDialogLanguage();
            }
        });

        btn_login.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String userName = mEdtUserName.getText().toString().trim();
                String passWord = mEdtPassword.getText().toString().trim();
                if (TextUtils.isEmpty(userName) || TextUtils.isEmpty(passWord)) {
                    Toast.makeText(LoginActivity.this, "Làm Ơn Nhập UserName Và Password", Toast.LENGTH_LONG).show();
                } else {
                    new LoginHelper(LoginActivity.this, userName, passWord, mOnLoginCallBack);
                }
            }
        });
    }

    private void displayDialogLanguage() {
        Logger.i(TAG, "displayDialogLanguage","");
        final String[] items = {getString(R.string.language_english), getString(R.string.language_vietnam)};
        Dialog dialog;
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setIcon(R.drawable.language);
        builder.setTitle(R.string.language_choose);
        builder.setItems(items, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Logger.i(TAG, "displayDialogLanguage", "Item : " + items[which]);
            }
        }).setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {

            }
        });
        dialog = builder.create();
        dialog.show();

        // TODO Auto-generated method stub

    }

    private void setLanguage(String language) {
        Locale locale = new Locale(language);
        Configuration configuration = new Configuration();
        configuration.locale = locale;
        getBaseContext().getResources().updateConfiguration(configuration, getBaseContext().getResources().getDisplayMetrics());
        Intent intent = new Intent(this, LoginActivity.class);
        startActivity(intent);
        finish();
    }

    /**
     * Request Database
     */

    private void prePareData() {
        mDatabaseHelper = new DatabaseHelper(this);
        try {
            mDatabaseHelper.createDataBase();
            mDatabaseHelper.openDataBase();

        } catch (Exception e) {
            e.printStackTrace();
        }
        SQLiteDatabase sd = mDatabaseHelper.getReadableDatabase();
        Cursor cursor = sd.query("login", null, null, null, null, null, null);
        try {
            if (cursor.moveToFirst()) {
                String a = cursor.getString(cursor.getColumnIndex("userName"));
                String b = cursor.getString(cursor.getColumnIndex("passWord"));
                Log.d(TAG, "prePareData1 : " + a + " : " + b);
                Toast.makeText(this, "prePareData1 : " + a + " : " + b, Toast.LENGTH_LONG).show();
            }
        } catch (Exception e) {
            Log.d(TAG, "prePareData1 : " + e.toString());
        }

    }

//    @Override
//    public void onNoFingerPrintHardwareFound() {
//        Logger.e(TAG, "onNoFingerPrintHardwareFound", "no Hardware");
//    }
//
//    @Override
//    public void onNoFingerPrintRegistered() {
//        Toast.makeText(this, getString(R.string.finger_print_register), Toast.LENGTH_LONG).show();
//        Logger.e(TAG, "onNoFingerPrintHardwareFound", "no Hardware");
//    }
//
//    @Override
//    public void onBelowMarshmallow() {
//
//    }
//
//    @Override
//    public void onAuthSuccess(FingerprintManager.CryptoObject cryptoObject) {
//        Intent intent = new Intent(this, DashBoardActivity.class);
//        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
//        startActivity(intent);
//    }
//
//    @Override
//    public void onAuthFailed(int i, String s) {
//        Toast.makeText(this, getString(R.string.finger_print_login_fail), Toast.LENGTH_LONG).show();
//        Logger.e(TAG, "onAuthFailed", "Login Failv  ");
//    }
}
