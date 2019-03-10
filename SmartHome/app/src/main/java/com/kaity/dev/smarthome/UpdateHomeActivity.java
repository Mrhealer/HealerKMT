package com.kaity.dev.smarthome;

import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.provider.MediaStore;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;

import java.io.FileNotFoundException;
import java.io.IOException;

public class UpdateHomeActivity extends AppCompatActivity implements View.OnClickListener {

    private static final String TAG = UpdateHomeActivity.class.getSimpleName();
    private ImageView mImageChose;
    private EditText mEdt_InputID, mEdt_InputIDDevice, mEdt_Input_Name_Device, mEdt_Content_Device, mEdt_Type_Device;
    private Button mButton_AddDevice;
    private int PICK_IMAGE_REQUEST = 1;
    private Bitmap mBitmap;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_update_home_layout);
        initView();
    }

    private void initView() {
        mImageChose = findViewById(R.id.img_Add_Device);
        mEdt_InputID = findViewById(R.id.edt_input_ID);
        mEdt_InputIDDevice = findViewById(R.id.edt_input_ID_Device);
        mEdt_Input_Name_Device = findViewById(R.id.edt_input_Name_Device);
        mEdt_Content_Device = findViewById(R.id.edt_input_Content_Device);
        mEdt_Type_Device = findViewById(R.id.edt_input_Type_Device);
        mButton_AddDevice = findViewById(R.id.btn_Submit_Device);
        mButton_AddDevice.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.img_Add_Device:
                break;
            case R.id.btn_Submit_Device:
                break;
        }
    }

    private void showFileChooser() {
        Intent intent = new Intent();
        intent.setType("image/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (PICK_IMAGE_REQUEST == requestCode && resultCode == RESULT_OK && data != null && data.getData() != null) {
            Uri filePath = data.getData();
            try {
                //Getting the Bitmap from Gallery
                mBitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), filePath);
                //Setting the bitmap to ImageView
                mImageChose.setImageBitmap(mBitmap);
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
