package com.kaity.dev.smarthome.Splash;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.Window;
import android.view.WindowManager;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.kaity.dev.smarthome.DashBoard.HomeActivity;
import com.kaity.dev.smarthome.LoginActivity;
import com.kaity.dev.smarthome.R;
import com.kaity.dev.smarthome.Utils.Constants;
import com.kaity.dev.smarthome.Utils.Logger;

public class SplashActivity extends AppCompatActivity {
    private static final String TAG = SplashActivity.class.getSimpleName();

    private static final int WAITED_INDEX = 2500;
    private static final int DEFAULT_SLEEP = 100;
    private Thread mSplashThread;
    private SharedPreferences mSharedPref;
    private LinearLayout mLinearLayout;
    private TextView mTextDecription;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_splash_layout);
        mLinearLayout = findViewById(R.id.linearLayoutSplash);
        mTextDecription = findViewById(R.id.tv_TextSplashDescription);
        Logger.i(TAG, "onCreate", "");
        mSharedPref = getSharedPreferences(Constants.SHARED_PREFERENCE_NAME, Context.MODE_PRIVATE);
        startAnimation();
    }

    @SuppressLint("ResourceAsColor")
    private void startAnimation() {
        /*Logger.i(TAG, "startAnimation", "");
        Animation animation = AnimationUtils.loadAnimation(this, R.anim.anim_translater);
        animation.reset();
        RelativeLayout relativeLayout = (RelativeLayout) findViewById(R.id.Layout_Splash);
        relativeLayout.clearAnimation();
        relativeLayout.startAnimation(animation);
        animation = AnimationUtils.loadAnimation(this, R.anim.img_splash_rotate);
        animation.setRepeatCount(Animation.ABSOLUTE);
        animation.reset();
        final ImageView imageView = (ImageView) findViewById(R.id.img_logo_splash);
        imageView.clearAnimation();
        imageView.startAnimation(animation);
        mSplashThread = new Thread() {
            @Override
            public void run() {
                try {
                    int waited = 0;
                    while (waited < WAITED_INDEX) {
                        sleep(DEFAULT_SLEEP);
                        waited += DEFAULT_SLEEP;
                    }
                    imageView.clearAnimation();
                    Intent intent = new Intent();
                    if (TextUtils.isEmpty(mSharedPref.getString(Constants.USER_ID_INDEX_KEY, Constants.EMPTY_STRING))) {
                        intent.setClass(SplashActivity.this, LoginActivity.class);
                    } else {
                        intent.setClass(SplashActivity.this, HomeActivity.class);
                    }
                    intent.setFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
                    startActivity(intent);
                    SplashActivity.this.finish();

                } catch (InterruptedException e) {
                    Logger.e(TAG, "startAnimation ", "startAnimation");
                } finally {
                    SplashActivity.this.finish();
                }
            }
        };
        mSplashThread.start();*/
        mSplashThread = new Thread() {
            @Override
            public void run() {
                Animation animation = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.downtoup);
                Animation animation2 = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.uptodown);
//                animation.setStartOffset(2000);
                mLinearLayout.setAnimation(animation);
                mTextDecription.setAnimation(animation2);
                try {
                    int waited = 0;
                    while (waited < WAITED_INDEX) {
                        sleep(DEFAULT_SLEEP);
                        waited += DEFAULT_SLEEP;
                    }
                    Intent intent = new Intent();
                    if (TextUtils.isEmpty(mSharedPref.getString(Constants.USER_ID_INDEX_KEY, Constants.EMPTY_STRING))) {
                        intent.setClass(SplashActivity.this, LoginActivity.class);
                    } else {
                        intent.setClass(SplashActivity.this, HomeActivity.class);
                    }
                    intent.setFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
                    startActivity(intent);
                    SplashActivity.this.finish();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    SplashActivity.this.finish();
                }
            }

        };
        mSplashThread.start();
    }
}