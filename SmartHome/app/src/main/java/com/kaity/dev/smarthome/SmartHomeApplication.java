package com.kaity.dev.smarthome;

import android.app.Application;

import com.kaity.dev.smarthome.Utils.Constants;

import java.net.URISyntaxException;

import io.socket.client.IO;
import io.socket.client.Socket;

public class SmartHomeApplication extends Application {

    private Socket mSocket;

    {
        try {
            mSocket = IO.socket(Constants.URL_API_CONTROL_DEVICE);
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
    }

    public Socket getSocket() {
        return mSocket;
    }
}
