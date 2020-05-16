package com.kaity.dev.smarthome.Device.Apdater;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.kaity.dev.smarthome.Device.Model.StageModel;
import com.kaity.dev.smarthome.R;

import java.util.ArrayList;

public class StageAdapter extends RecyclerView.Adapter<StageAdapter.MyHolderView> {
    private ArrayList<StageModel> mArrayList;
    private Context mContext;
    private onClickStage mOnClickStage;
    private onLongItemClickStage mOnLongItemClickState;


    public StageAdapter(Context context, ArrayList<StageModel> mArrayList, onClickStage onClickStage,
                        onLongItemClickStage onLongItemClickStage) {
        this.mContext = context;
        this.mArrayList = mArrayList;
        this.mOnClickStage = onClickStage;
        this.mOnLongItemClickState = onLongItemClickStage;
    }

    @NonNull
    @Override
    public MyHolderView onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(mContext).inflate(R.layout.item_device_horizontal, viewGroup, false);

        return new MyHolderView(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MyHolderView myHolderView, int i) {
        myHolderView.setData(mArrayList.get(i));
    }

    @Override
    public int getItemCount() {
        return mArrayList.size();
    }

    public class MyHolderView extends RecyclerView.ViewHolder implements View.OnClickListener, View.OnLongClickListener {
        private TextView tv;
        private ImageView imageView;

        public MyHolderView(@NonNull View itemView) {
            super(itemView);
            tv = (TextView) itemView.findViewById(R.id.textView_total);
            imageView = (ImageView) itemView.findViewById(R.id.imageView_total);
            imageView.setOnClickListener(this);
            imageView.setOnLongClickListener(this);
        }

        public void setData(StageModel stageModel) {
            tv.setText(stageModel.getmName());
            imageView.setImageResource(stageModel.getmImage());
        }

        @Override
        public void onClick(View v) {
            switch (v.getId()) {
                case R.id.imageView_total:
                    mOnClickStage.onClick(getAdapterPosition(), v);
                    break;
            }
        }

        @Override
        public boolean onLongClick(View v) {
            switch (v.getId()) {
                case R.id.imageView_total:
                    mOnLongItemClickState.onItemLongClick(getAdapterPosition(), v);
                    break;
            }
            return true;
        }
    }

    public interface onClickStage {
        void onClick(int position, View v);
    }

    public interface onLongItemClickStage {
        void onItemLongClick(int position, View view);
    }
}
