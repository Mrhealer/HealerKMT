package com.kaity.dev.smarthome.Splash;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.RelativeLayout;

import com.kaity.dev.smarthome.LoginActivity;
import com.kaity.dev.smarthome.R;
import com.kaity.dev.smarthome.Utils.Logger;

public class SplashActivity extends AppCompatActivity {
    private static final String TAG = SplashActivity.class.getSimpleName();

    private static final int WAITED_INDEX = 3500;
    private static final int DEFAULT_SLEEP = 100;
    private Thread mSplashThread;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_splash_layout);
        Logger.i(TAG, "onCreate", "");
        startAnimation();
    }

    @SuppressLint("ResourceAsColor")
    private void startAnimation() {
        Logger.i(TAG, "startAnimation", "");
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
                    Intent intent = new Intent(SplashActivity.this, LoginActivity.class);
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
        mSplashThread.start();
    }
}
