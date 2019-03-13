package com.kaity.dev.smarthome.Device.Apdater;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.kaity.dev.smarthome.Device.Model.DeviceModel;
import com.kaity.dev.smarthome.R;

import java.util.ArrayList;

public class DeviceRightAdapter extends RecyclerView.Adapter<DeviceRightAdapter.MyHolderView> {
    private ArrayList<DeviceModel> mArrayList;
    private Context mContext;
    private DeviceAdapter.onClickListenerDevice mOnClickListener;

    public DeviceRightAdapter(Context context,ArrayList<DeviceModel> mArrayList, DeviceAdapter.onClickListenerDevice onClickListener) {
        this.mContext = context;
        this.mArrayList = mArrayList;
        this.mOnClickListener = onClickListener;
    }

    @NonNull
    @Override
    public DeviceRightAdapter.MyHolderView onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(mContext).inflate(R.layout.item_device_right_menu, viewGroup, false);

        return new DeviceRightAdapter.MyHolderView(view);
    }

    @Override
    public void onBindViewHolder(@NonNull DeviceRightAdapter.MyHolderView myHolderView, int i) {
        myHolderView.setData(mArrayList.get(i));
    }

    @Override
    public int getItemCount() {
        return mArrayList.size();
    }


    public class MyHolderView extends RecyclerView.ViewHolder implements View.OnClickListener {

        private TextView tv;
        private ImageView imageView;
        private DeviceModel deviceModel;

        public MyHolderView(@NonNull View itemView) {
            super(itemView);
            itemView.setOnClickListener(this);
            tv = (TextView) itemView.findViewById(R.id.title_right);
            imageView = (ImageView) itemView.findViewById(R.id.img_device_right);
        }

        public void setData(DeviceModel deviceModel) {
            tv.setText(deviceModel.getmName());
            if (imageView == null) {
                imageView.setImageResource(R.drawable.room_background);
            } else {
                imageView.setImageResource(deviceModel.getmImage());
            }
        }

        @Override
        public void onClick(View v) {
            mOnClickListener.onClickDevice(getAdapterPosition(), v);
        }
    }
}
