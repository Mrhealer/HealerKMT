package com.kaity.dev.smarthome.DashBoard.MenuLeft;

public class ItemMenu {
    private int mImageId;
    private String mTitle;

    public ItemMenu(int mImageId, String mTitle) {
        this.mImageId = mImageId;
        this.mTitle = mTitle;
    }

    public int getmImageId() {
        return mImageId;
    }

    public void setmImageId(int mImageId) {
        this.mImageId = mImageId;
    }

    public String getmTitle() {
        return mTitle;
    }

    public void setmTitle(String mTitle) {
        this.mTitle = mTitle;
    }
}
