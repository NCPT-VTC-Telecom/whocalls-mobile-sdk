package com.whocalls;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.telephony.TelephonyManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;


public class CallDetectionModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext reactContext;
  private CallStateReceiver callStateReceiver;
  private boolean isReceiverRegistered = false;



  public CallDetectionModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.callStateReceiver = new CallStateReceiver();
  }

  @Override
  public String getName() {
    return "CallDetection";
  }

  @ReactMethod
  public void startListener() {
    if (!isReceiverRegistered) {
      IntentFilter intentFilter = new IntentFilter();
      intentFilter.addAction(TelephonyManager.ACTION_PHONE_STATE_CHANGED);
      reactContext.registerReceiver(callStateReceiver, intentFilter);
      isReceiverRegistered = true;
    }
  }

  @ReactMethod
  public void stopListener() {
    if (isReceiverRegistered) {
      reactContext.unregisterReceiver(callStateReceiver);
      isReceiverRegistered = false;
    }
  }

  private void sendEvent(String eventName, WritableMap params) {
    reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
  }

  private class CallStateReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
      String state = intent.getStringExtra(TelephonyManager.EXTRA_STATE);
      String phoneNumber = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER);

      WritableMap params = Arguments.createMap();
      params.putString("state", state);

      if (phoneNumber != null) {
        params.putString("phoneNumber", phoneNumber);
      }

      sendEvent("callStateUpdated", params);
    }
  }
}
