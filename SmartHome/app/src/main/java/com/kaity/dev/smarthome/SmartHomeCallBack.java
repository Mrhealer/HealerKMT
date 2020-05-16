package com.kaity.dev.smarthome;

import com.kaity.dev.smarthome.Device.Model.DeviceModel;
import com.kaity.dev.smarthome.Device.Model.StageModel;

import java.util.ArrayList;

public interface SmartHomeCallBack {
    void onLoadSuccess(ArrayList<DeviceModel> arrayList);

    void onLoadStateSuccess(ArrayList<StageModel> arrayList);
}
