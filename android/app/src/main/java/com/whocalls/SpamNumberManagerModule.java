package com.whocalls;

import android.content.SharedPreferences;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import java.util.HashSet;
import java.util.Set;
import java.util.ArrayList;

/** This modules for creating the SpamNumbers Manager modules
 *  for native experience*/

public class SpamNumberManagerModule extends ReactContextBaseJavaModule {
  private static final String PREF_NAME = "SpamList";
  private static final String KEY_SPAM_NUMBERS = "spamNumbers";

  public SpamNumberManagerModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "SpamNumberManager";
  }

  @ReactMethod
  public void addToSpamList(String number) {
    SharedPreferences prefs = getReactApplicationContext().getSharedPreferences(PREF_NAME, 0);
    Set<String> spamSet = new HashSet<>(prefs.getStringSet(KEY_SPAM_NUMBERS, new HashSet<>()));
    spamSet.add(number);
    prefs.edit().putStringSet(KEY_SPAM_NUMBERS, spamSet).apply();
  }

  @ReactMethod
  public void removeFromSpamList(String number) {
    SharedPreferences prefs = getReactApplicationContext().getSharedPreferences(PREF_NAME, 0);
    Set<String> spamSet = new HashSet<>(prefs.getStringSet(KEY_SPAM_NUMBERS, new HashSet<>()));
    spamSet.remove(number);
    prefs.edit().putStringSet(KEY_SPAM_NUMBERS, spamSet).apply();
  }

  @ReactMethod
  public void getSpamList(Callback callback) {
    SharedPreferences prefs = getReactApplicationContext().getSharedPreferences(PREF_NAME, 0);
    Set<String> spamSet = prefs.getStringSet(KEY_SPAM_NUMBERS, new HashSet<>());
    callback.invoke(new ArrayList<>(spamSet));
  }

  public void emitBlockedCallEvent(String phoneNumber) {
    WritableMap params = Arguments.createMap();
    params.putString("phoneNumber", phoneNumber);
    getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("CallBlocked", params);
  }
}