package com.kaity.dev.smarthome;

import com.kaity.dev.smarthome.Device.Model.DeviceModel;

import java.util.ArrayList;

public interface SmartHomeCallBack {
    void onLoadSuccess(ArrayList<DeviceModel> arrayList);
}
