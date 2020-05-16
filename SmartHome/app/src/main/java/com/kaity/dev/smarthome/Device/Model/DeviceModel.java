package com.kaity.dev.smarthome.Device.Model;

public class DeviceModel {
    private String mName;
    private int mImage;
    private String Color;

    public DeviceModel(String mName, int mImage, String color) {
        this.mName = mName;
        this.mImage = mImage;
        Color = color;
    }

    public String getmName() {
        return mName;
    }

    public void setmName(String mName) {
        this.mName = mName;
    }

    public int getmImage() {
        return mImage;
    }

    public void setmImage(int mImage) {
        this.mImage = mImage;
    }

    public String getColor() {
        return Color;
    }

    public void setColor(String color) {
        Color = color;
    }
}
