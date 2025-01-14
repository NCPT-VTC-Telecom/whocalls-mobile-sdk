package com.whocalls;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.kavsdk.license.SdkLicenseException;



public class WhoCallsModule extends ReactContextBaseJavaModule {

  public String TAG = "WhoCalls Started";

  public WhoCallsModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }
  @NonNull
  public String getName() {
    return "WhoCallSDK";
  }


  /** Create and intitalize the SDK to function properly**/
  @ReactMethod
  public void onCreate() {
    Log.i(TAG, "Sample application started");
    sendEvent(getReactApplicationContext(), "Status", "start");
    new Thread(() -> {
      //        initializeSdk();
    }).start();
  }

  private void sendEvent(ReactContext reactContext, String eventName, @Nullable String message) {
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, message);
  }
}

