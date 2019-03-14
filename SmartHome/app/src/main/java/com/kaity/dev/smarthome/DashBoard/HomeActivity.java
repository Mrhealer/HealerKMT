package com.kaity.dev.smarthome.DashBoard;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.design.widget.BottomSheetBehavior;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.DividerItemDecoration;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ListView;

import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.kaity.dev.smarthome.BottomSheetActionFragment;
import com.kaity.dev.smarthome.DashBoard.MenuLeft.ItemMenu;
import com.kaity.dev.smarthome.DashBoard.MenuLeft.MenuLeftAdapter;
import com.kaity.dev.smarthome.Device.Apdater.DeviceAdapter;
import com.kaity.dev.smarthome.Device.Apdater.DeviceRightAdapter;
import com.kaity.dev.smarthome.Device.Apdater.StageAdapter;
import com.kaity.dev.smarthome.Device.Model.DeviceModel;
import com.kaity.dev.smarthome.Device.Model.StageModel;
import com.kaity.dev.smarthome.R;
import com.kaity.dev.smarthome.SmartHomeCallBack;
import com.kaity.dev.smarthome.UpdateHomeActivity;
import com.kaity.dev.smarthome.Utils.Constants;
import com.kaity.dev.smarthome.Utils.Logger;
import com.kaity.dev.smarthome.VolleyLib.VolleySingleton;
import com.navdrawer.SimpleSideDrawer;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;


public class HomeActivity extends AppCompatActivity implements StageAdapter.onClickStage,
        StageAdapter.onLongItemClickStage, DeviceAdapter.onClickListenerDevice, SmartHomeCallBack {

    private Toolbar mToolbar;
    private DrawerLayout mDrawerLayout;
    private ActionBarDrawerToggle mDrawerToggle;
    private ListView mListView;
    private ArrayList<ItemMenu> mArrayList;
    private MenuLeftAdapter mMenuLeftAdapter;
    private SimpleSideDrawer mSimpleSideDrawer;
    private RecyclerView mRecyclerViewDevice;
    private RecyclerView mRecyclerViewStage;
    private RecyclerView mRecyclerViewRightDevice;
    private ArrayList<StageModel> mArrayListStage;
    private ArrayList<DeviceModel> mArrayListDevice;
    private ArrayList<DeviceModel> mArrayListRightDevice;
    private int mCountDeviceSize, mCountStageSize;
    private BottomSheetBehavior mBottomSheetBehavior;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.home_activity_layout);
        mCountDeviceSize = 0;
        mCountStageSize = 0;
        mArrayList = new ArrayList<>();
        init();
        setSupportActionBar(mToolbar);
        getSupportActionBar().setDisplayShowTitleEnabled(false);
        mArrayListDevice = getAllDeviceArrayList();
        mArrayListRightDevice = getAllDeviceArrayList();
        mArrayListStage = getAllActionArrayList();
        initDrawerLayout();
        initDataStage();
        initDataDevice();
        initListeners();
    }

    private void init() {
        mListView = findViewById(R.id.list);
        mToolbar = findViewById(R.id.toolbar);
        mDrawerLayout = findViewById(R.id.drawerLayout);
        mRecyclerViewStage = findViewById(R.id.RecyclerView_Stage);
        mRecyclerViewDevice = findViewById(R.id.RecyclerView);
        mBottomSheetBehavior = BottomSheetBehavior.from(findViewById(R.id.bottomSheetLayout));
        mBottomSheetBehavior.setState(BottomSheetBehavior.STATE_HIDDEN);
    }

    private void initDataStage() {
        if (mArrayListStage != null) {
            mCountStageSize = mArrayListStage.size();
        }
        StageAdapter stageAdapter = new StageAdapter(this, mArrayListStage, this, this);
        stageAdapter.notifyDataSetChanged();
        mRecyclerViewStage.setItemAnimator(new DefaultItemAnimator());
        mRecyclerViewStage.setLayoutManager(new GridLayoutManager(this, 1, GridLayoutManager.HORIZONTAL, false));
        mRecyclerViewStage.setAdapter(stageAdapter);
    }


    private void initDataDevice() {
        if (mArrayListDevice != null) {
            mCountDeviceSize = mArrayListDevice.size();
        }
        DeviceAdapter adapter = new DeviceAdapter(this, mArrayListDevice, this);
        adapter.notifyDataSetChanged();

        mRecyclerViewDevice.setItemAnimator(new DefaultItemAnimator());
        mRecyclerViewDevice.setHasFixedSize(true);
        mRecyclerViewDevice.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.VERTICAL));
        mRecyclerViewDevice.setLayoutManager(new GridLayoutManager(this, 3));
        mRecyclerViewDevice.setAdapter(adapter);
    }

    private ArrayList<StageModel> getAllActionArrayList() {
        final ArrayList<StageModel> arrayList = new ArrayList<>();
        StringRequest stringRequest = new StringRequest(Constants.ACTION_USER_URL, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject jsonObject = new JSONObject(response);
                    JSONArray jsonArray = jsonObject.getJSONArray("data");
                    for (int i = 0; i < jsonArray.length(); i++) {
                        String nameDevice = jsonArray.getJSONObject(i).getString("name");
                        arrayList.add(new StageModel(nameDevice, R.drawable.venha, ""));
                    }
                    onLoadStateSuccess(arrayList);
                    Logger.i(this, "getAllActionArrayList", "onResponse " + arrayList.toString());
                } catch (JSONException e) {
                    Logger.e(this, "getAllActionArrayList", "JSONException " + e.toString());
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Logger.e(this, "getAllActionArrayList", "onErrorResponse ");
            }
        });
        VolleySingleton.getInstance(getApplicationContext()).addToRequestQueue(stringRequest);
        return arrayList;
    }

    private ArrayList<DeviceModel> getAllDeviceArrayList() {
        final ArrayList<DeviceModel> arrayList = new ArrayList<>();
        StringRequest stringRequest = new StringRequest(Constants.URL_API_DEVICE, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject jsonObject = new JSONObject(response);
                    JSONArray jsonArray = jsonObject.getJSONArray("data");
                    for (int i = 0; i < jsonArray.length(); i++) {
                        String nameDevice = jsonArray.getJSONObject(i).getString("name");
                        arrayList.add(new DeviceModel(nameDevice, R.drawable.device, ""));
                    }
                    onLoadSuccess(arrayList);
                    Logger.i(this, "getAllDeviceArrayList", "onResponse " + arrayList.toString());
                } catch (JSONException e) {
                    Logger.e(this, "getAllDeviceArrayList", "JSONException " + e.toString());
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Logger.e(this, "getAllDeviceArrayList", "onErrorResponse ");
            }
        });
        VolleySingleton.getInstance(getApplicationContext()).addToRequestQueue(stringRequest);
        return arrayList;

    }


    private void initRightDevice() {
        DeviceRightAdapter adapter = new DeviceRightAdapter(this, mArrayListRightDevice, this);
        adapter.notifyDataSetChanged();
        RecyclerView.LayoutManager mLayoutManager = new LinearLayoutManager(getApplicationContext());
        mRecyclerViewRightDevice.setLayoutManager(mLayoutManager);
        mRecyclerViewRightDevice.setItemAnimator(new DefaultItemAnimator());
        mRecyclerViewRightDevice.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.VERTICAL));
        mRecyclerViewRightDevice.setHasFixedSize(true);
        mRecyclerViewRightDevice.setAdapter(adapter);

    }

    private void initDrawerLayout() {
        setListViewData();
        setListViewHeader();
        mMenuLeftAdapter = new MenuLeftAdapter(this, R.layout.item_menu_left, mArrayList);
        mListView.setAdapter(mMenuLeftAdapter);

        mDrawerToggle = new ActionBarDrawerToggle(this, mDrawerLayout, mToolbar,
                R.string.drawer_open, R.string.drawer_close) {

            @Override
            public void onDrawerClosed(View drawerView) {
                super.onDrawerClosed(drawerView);
                invalidateOptionsMenu();
            }

            @Override
            public void onDrawerOpened(View drawerView) {
                super.onDrawerOpened(drawerView);
                invalidateOptionsMenu();
            }
        };
        mDrawerLayout.setDrawerListener(mDrawerToggle);
        mSimpleSideDrawer = new SimpleSideDrawer(this);
        mSimpleSideDrawer.setRightBehindContentView(R.layout.item_menu_right_layout);

    }

    private void initListeners() {
        mBottomSheetBehavior.setBottomSheetCallback(new BottomSheetBehavior.BottomSheetCallback() {
            @Override
            public void onStateChanged(@NonNull View view, int i) {
                switch (i) {
                    case BottomSheetBehavior.STATE_COLLAPSED:
                        Logger.e(this, "initListeners", "STATE_COLLAPSED");
                        break;
                    case BottomSheetBehavior.STATE_DRAGGING:
                        Logger.e(this, "initListeners", "STATE_DRAGGING");
                        break;
                    case BottomSheetBehavior.STATE_EXPANDED:
                        Logger.e(this, "initListeners", "STATE_EXPANDED");
                        break;
                    case BottomSheetBehavior.STATE_HIDDEN:
                        Logger.e(this, "initListeners", "STATE_HIDDEN");
                        break;
                    case BottomSheetBehavior.STATE_SETTLING:
                        Logger.e(this, "initListeners", "STATE_SETTLING");
                        break;
                }
            }

            @Override
            public void onSlide(@NonNull View view, float v) {

            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.home, menu);
        return true;
    }


    @SuppressLint("WrongViewCast")
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (mDrawerToggle.onOptionsItemSelected(item)) {
            return true;
        }
        switch (item.getItemId()) {
            case R.id.action_add_device:
                Intent intent = new Intent(this, UpdateHomeActivity.class);
                startActivity(intent);
                break;
            case R.id.action_device_list:
                mRecyclerViewRightDevice = findViewById(R.id.RecyclerView_Right);
                initRightDevice();
                mSimpleSideDrawer.toggleRightDrawer();
                break;
        }

        return true;
    }

    private void setListViewHeader() {
        LayoutInflater inflater = getLayoutInflater();
        View header = inflater.inflate(R.layout.header_menu_left, mListView, false);
        mListView.addHeaderView(header, null, false);
    }

    private void setListViewData() {
        mArrayList.add(new ItemMenu(R.drawable.add_device_left, getString(R.string.add_device_left)));
        mArrayList.add(new ItemMenu(R.drawable.copy_left, getString(R.string.copy_left)));
        mArrayList.add(new ItemMenu(R.drawable.share_left, getString(R.string.share_left)));
        mArrayList.add(new ItemMenu(R.drawable.settings_left, getString(R.string.settings_left)));
        mArrayList.add(new ItemMenu(R.drawable.feedback_left, getString(R.string.feedback_left)));
        mArrayList.add(new ItemMenu(R.drawable.help_left, getString(R.string.help_left)));
        mArrayList.add(new ItemMenu(R.drawable.demo_left, getString(R.string.demo_left)));
    }

    @Override
    protected void onPostCreate(@Nullable Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
        mDrawerToggle.syncState();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        mDrawerToggle.onConfigurationChanged(newConfig);
    }

    @Override
    public void onClick(int position, View v) {

    }

    @Override
    public void onItemLongClick(int position, View view) {
        new BottomSheetActionFragment().show(getSupportFragmentManager(), "FragmentAction");
    }

    @Override
    public void onClickDevice(int position, View v) {

    }

    @Override
    public void onLoadSuccess(ArrayList<DeviceModel> arrayList) {
        if (mCountDeviceSize != 0) {
            if (mCountDeviceSize != arrayList.size()) {
                updateRecyclerViewDevice(arrayList);
            } else {
                Logger.i(this, "onLoadSuccess", "not need reset screen");
            }

        } else {
            updateRecyclerViewDevice(arrayList);
        }

    }

    @Override
    public void onLoadStateSuccess(ArrayList<StageModel> arrayList) {
        if (mCountStageSize != 0) {
            if (mCountStageSize != arrayList.size()) {
                updateAction(arrayList);
            } else {
                Logger.i(this, "onLoadStateSuccess", "not need reset screen");
            }
        } else {
            updateAction(arrayList);
        }
    }

    private void updateRecyclerViewDevice(ArrayList<DeviceModel> arrayList) {
        Logger.i(this, "updateRecyclerViewDevice", "listDevice : " + arrayList.size());
        if (mRecyclerViewDevice != null) {
            while (mRecyclerViewDevice.getItemDecorationCount() > 0) {
                mRecyclerViewDevice.removeItemDecorationAt(0);
            }
        }
        DeviceAdapter adapter = new DeviceAdapter(this, arrayList, this);
        adapter.notifyDataSetChanged();
        mRecyclerViewDevice.setItemAnimator(new DefaultItemAnimator());
        mRecyclerViewDevice.setHasFixedSize(true);
        mRecyclerViewDevice.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.VERTICAL));
        mRecyclerViewDevice.setLayoutManager(new GridLayoutManager(this, 3));
        mRecyclerViewDevice.setAdapter(adapter);
    }

    private void updateAction(ArrayList<StageModel> arrayList) {
        Logger.i(this, "updateAction", "listDevice : " + arrayList.size());
        if (mRecyclerViewStage != null) {
            while (mRecyclerViewStage.getItemDecorationCount() > 0) {
                mRecyclerViewStage.removeItemDecorationAt(0);
            }
        }
        StageAdapter stageAdapter = new StageAdapter(this, mArrayListStage, this, this);
        stageAdapter.notifyDataSetChanged();
        mRecyclerViewStage.setItemAnimator(new DefaultItemAnimator());
        mRecyclerViewStage.setLayoutManager(new GridLayoutManager(this, 1, GridLayoutManager.HORIZONTAL, false));
        mRecyclerViewStage.setAdapter(stageAdapter);
    }

}
