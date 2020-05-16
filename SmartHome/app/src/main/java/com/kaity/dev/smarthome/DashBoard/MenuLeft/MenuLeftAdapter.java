package com.kaity.dev.smarthome.DashBoard.MenuLeft;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.kaity.dev.smarthome.CheckWifiActivity;
import com.kaity.dev.smarthome.DashBoard.Demo.DemoActivity;
import com.kaity.dev.smarthome.DashBoard.Settings.SettingsActivity;
import com.kaity.dev.smarthome.R;

import java.util.ArrayList;

public class MenuLeftAdapter extends ArrayAdapter<ItemMenu> {

    private Context mContext;
    private ArrayList<ItemMenu> mArrayList;

    public MenuLeftAdapter(Context context, int resource, ArrayList<ItemMenu> arrayList) {
        super(context, resource, arrayList);
        this.mContext = context;
        this.mArrayList = arrayList;

    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        ViewHolder holder = null;
        LayoutInflater inflater = (LayoutInflater) mContext.getSystemService(Activity.LAYOUT_INFLATER_SERVICE);
        // If holder not exist then locate all view from UI file.
        if (convertView == null) {
            // inflate UI from XML file
            convertView = inflater.inflate(R.layout.item_menu_left, parent, false);
            // get all UI view
            holder = new ViewHolder(convertView);
            // set tag for holder
            convertView.setTag(holder);
        } else {
            // if holder created, get tag from view
            holder = (ViewHolder) convertView.getTag();
        }

        holder.title.setText(getItem(position).getmTitle());
        holder.icon.setImageResource(getItem(position).getmImageId());

        //handling each item on click
        convertView.setOnClickListener(onClickListener(position));

        return convertView;
    }

    private View.OnClickListener onClickListener(final int position) {
        return new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                switch (position) {
                    case 0:
                        Intent intent0 = new Intent(mContext, CheckWifiActivity.class);
                        mContext.startActivity(intent0);
                        break;
                    case 3:
                        Intent intent = new Intent(mContext, SettingsActivity.class);
                        mContext.startActivity(intent);
                        break;
                    case 6:
                        Intent intent1 = new Intent(mContext, CheckWifiActivity.class);
                        mContext.startActivity(intent1);
                        break;
                }

            }
        };
    }

    private class ViewHolder {
        private ImageView icon;
        private TextView title;

        public ViewHolder(View view) {
            icon = (ImageView) view.findViewById(R.id.icon);
            title = (TextView) view.findViewById(R.id.name);
        }
    }
}
