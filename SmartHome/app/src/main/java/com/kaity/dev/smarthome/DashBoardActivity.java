package com.kaity.dev.smarthome;

import android.annotation.SuppressLint;
import android.support.design.widget.FloatingActionButton;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.LinearLayout;

import com.kaity.dev.smarthome.Device.Apdater.DeviceAdapter;
import com.kaity.dev.smarthome.Device.Apdater.StageAdapter;
import com.kaity.dev.smarthome.Device.Model.DeviceModel;
import com.kaity.dev.smarthome.Device.Model.StageModel;
import com.kaity.dev.smarthome.R;

import java.util.ArrayList;

public class DashBoardActivity extends AppCompatActivity implements DeviceAdapter.onClickListenerDevice, StageAdapter.onClickStage, View.OnClickListener {
    private RecyclerView mRecyclerView;
    private RecyclerView mRecyclerViewStage;
    private ArrayList<DeviceModel> mArrayList;
    private ArrayList<StageModel> mArrayListStage;
    private FloatingActionButton mFabOn, mFabOff;
    private Animation mAOpen, mAClose, mARotate_Forward, mARotate_Backward;
    private LinearLayout mLinearTurnOn, mLinearTurnOff;
    private boolean isFabOpen = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_dash_board);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        toolbar.setNavigationIcon(R.drawable.icon_dashboard);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayShowHomeEnabled(true);
        getSupportActionBar().setHomeButtonEnabled(true);
        mRecyclerView = (RecyclerView) findViewById(R.id.RecyclerView);
        mRecyclerViewStage = (RecyclerView) findViewById(R.id.RecyclerView_Stage);
        init();
        initDataStage();
        initDataDevice();
    }

    private void init() {
        mFabOn = (FloatingActionButton) findViewById(R.id.fab1);
        mFabOff = (FloatingActionButton) findViewById(R.id.fab2);
        mAOpen = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.fab_open);
        mAClose = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.fab_close);
        mARotate_Forward = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.rotate_forward);
        mARotate_Backward = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.roteate_backward);
        mLinearTurnOff = (LinearLayout) findViewById(R.id.turn_Off);
        mLinearTurnOn = (LinearLayout) findViewById(R.id.turn_ON);
        mFabOn.setOnClickListener(this);
        mFabOff.setOnClickListener(this);
    }

    private void initDataStage() {
        mArrayListStage = new ArrayList<>();
        mArrayListStage.add(new StageModel(getString(R.string.ve_nha), R.drawable.venha, "#333"));
        mArrayListStage.add(new StageModel(getString(R.string.di_lam), R.drawable.dilam, "#333"));
        mArrayListStage.add(new StageModel(getString(R.string.nau_an), R.drawable.nauan, "#333"));
        mArrayListStage.add(new StageModel(getString(R.string.di_ngu), R.drawable.dingu, "#333"));
        mArrayListStage.add(new StageModel(getString(R.string.thuc_day), R.drawable.thucday, "#333"));
        mArrayListStage.add(new StageModel(getString(R.string.di_tam), R.drawable.ditam, "#333"));
        mArrayListStage.add(new StageModel(getString(R.string.them_hoat_canh), R.drawable.add, "#333"));
//        StageAdapter stageAdapter = new StageAdapter(this, mArrayListStage, this,this);
//        stageAdapter.notifyDataSetChanged();
//        mRecyclerViewStage.setItemAnimator(new DefaultItemAnimator());
//        mRecyclerViewStage.setHasFixedSize(true);
//        mRecyclerViewStage.addItemDecoration(new DividerItemDecoration(this,
//                DividerItemDecoration.HORIZONTAL));
//        mRecyclerViewStage.addItemDecoration(new DividerItemDecoration(this,
//                DividerItemDecoration.VERTICAL));
//        mRecyclerViewStage.setLayoutManager(new GridLayoutManager(this, 1, GridLayoutManager.HORIZONTAL, false));
//        mRecyclerViewStage.setAdapter(stageAdapter);
    }

    private void initDataDevice() {
        mArrayList = new ArrayList<>();
        mArrayList.add(new DeviceModel(getString(R.string.quat_pk), R.drawable.device, "#333"));
        mArrayList.add(new DeviceModel(getString(R.string.quat_bep), R.drawable.device, "#333"));
        mArrayList.add(new DeviceModel(getString(R.string.quat_tang2), R.drawable.device, "#333"));
        mArrayList.add(new DeviceModel(getString(R.string.den_pk1), R.drawable.device, "#333"));
        mArrayList.add(new DeviceModel(getString(R.string.den_pk2), R.drawable.device, "#333"));
        mArrayList.add(new DeviceModel(getString(R.string.den_pk3), R.drawable.device, "#333"));
        mArrayList.add(new DeviceModel(getString(R.string.den_pk4), R.drawable.device, "#333"));
        mArrayList.add(new DeviceModel(getString(R.string.den_pk5), R.drawable.device, "#333"));
        mArrayList.add(new DeviceModel(getString(R.string.loa), R.drawable.device, "#333"));
        mArrayList.add(new DeviceModel(getString(R.string.binh_nong_lanh), R.drawable.device, "#333"));
        mArrayList.add(new DeviceModel(getString(R.string.may_say), R.drawable.device, "#333"));
        mArrayList.add(new DeviceModel(getString(R.string.may_giat), R.drawable.device, "#333"));
        mArrayList.add(new DeviceModel(getString(R.string.dieu_hoa), R.drawable.device, "#333"));

        DeviceAdapter adapter = new DeviceAdapter(this, mArrayList, this);
        adapter.notifyDataSetChanged();

        mRecyclerView.setItemAnimator(new DefaultItemAnimator());
        mRecyclerView.setHasFixedSize(true);
//        mRecyclerView.addItemDecoration(new DividerItemDecoration(this,
//                DividerItemDecoration.HORIZONTAL));
//        mRecyclerView.addItemDecoration(new DividerItemDecoration(this,
//                DividerItemDecoration.VERTICAL));
        mRecyclerView.setLayoutManager(new GridLayoutManager(this, 3));
        mRecyclerView.setAdapter(adapter);
    }

    @SuppressLint("RestrictedApi")
    private void handleAnimationFab() {
        if (isFabOpen) {
            mFabOn.startAnimation(mAClose);
            mFabOff.startAnimation(mAClose);
            mFabOn.setClickable(false);
            mFabOff.setClickable(false);
            isFabOpen = false;
            mLinearTurnOff.setVisibility(View.INVISIBLE);
            mLinearTurnOn.setVisibility(View.INVISIBLE);
        } else {
            mLinearTurnOff.setVisibility(View.VISIBLE);
            mLinearTurnOn.setVisibility(View.VISIBLE);
            mFabOn.startAnimation(mAOpen);
            mFabOff.startAnimation(mAOpen);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.action_bar, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.settings:
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onClick(View view) {
        int id = view.getId();
        switch (id) {
            case R.id.fab1:
                isFabOpen = true;
                handleAnimationFab();
                break;
            case R.id.fab2:
                isFabOpen = true;
                handleAnimationFab();
                break;
        }
    }

    @Override
    public void onClick(int position, View v) {

    }

    @Override
    public void onClickDevice(int position, View v) {
        handleAnimationFab();
    }
}
