package com.whocalls;

import android.annotation.SuppressLint;
import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.kaspersky.whocalls.externalapi.CustomNumberListManager;
import com.kaspersky.whocalls.externalapi.CustomPhoneInfo;
import com.kaspersky.whocalls.externalapi.CustomPhoneInfoBuilder;
import com.kaspersky.whocalls.externalapi.DatabasePhoneInfo;
import com.kaspersky.whocalls.externalapi.DatabasePhoneInfoException;
import com.kaspersky.whocalls.externalapi.PhoneNumber;
import com.kaspersky.whocalls.externalapi.PhoneNumberBuilder;
import com.kaspersky.whocalls.externalapi.WhoCallsSdkException;
import com.kaspersky.whocalls.externalapi.WhoCallsSdkFactory;
import com.kaspersky.whocalls.externalapi.WhoCallsSdkInitParams;
import com.kaspersky.whocalls.externalapi.WhoCallsSdkInitParamsBuilder;
import com.kaspersky.whocalls.externalapi.WhoCallsSdkManager;
import com.kavsdk.KavSdk;
import com.kavsdk.license.SdkLicense;
import com.kavsdk.license.SdkLicenseException;
import com.kavsdk.license.SdkLicenseViolationException;
import com.kavsdk.updater.Updater;

import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;


public class WhoCallsModule extends ReactContextBaseJavaModule {
  public String TAG = "WhoCalls Started";
  public WhoCallsModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @NonNull
  public String getName() {
    return "WhoCallSDK";
  }

  @ReactMethod
  public void onCreate() {
    new Thread(() -> initializeSdk()).start();
  }
  private void initializeSdk() {
    final File basesPath = Objects.requireNonNull(getCurrentActivity()).getApplicationContext()
            .getDir("bases", Context.MODE_PRIVATE);
    // SdkInitListener listener = (SdkInitListener) getCurrentActivity();
    if (KavSdk.isInitialized()) {// listener.log("SDK already initialized");
      return;
    }
    Context context = Objects.requireNonNull(getCurrentActivity()).getApplicationContext();
    WhoCallsSdkInitParams params = new WhoCallsSdkInitParamsBuilder(basesPath).build();

//    MainActivityCallback mExtListener = (MainActivityCallback) listener;
    try {

      WhoCallsSdkManager whoCallsSdk = WhoCallsSdkFactory.getWhoCallsSdkManager();
      if (whoCallsSdk == null)

        whoCallsSdk = WhoCallsSdkFactory.initializeWhoCallsSdk(context, params);
      // Check if the license is valid
      SdkLicense license = WhoCallsSdkFactory.getLicense();
      if (!license.isValid()) license.activate(null);
      Updater updater = Updater.getInstance();
      updater.updateAllBases((i, i1) -> false);

      Date lastUpdateDate = updater.getLastUpdateDate();
      SimpleDateFormat sdf = new SimpleDateFormat("yyyy-mm-dd");
      try {
        Date aVeryOldDate = sdf.parse("2020-01-01");
      } catch (ParseException e) {
        e.printStackTrace();
      }
      Log.i(TAG, "DB release date: " + updater.getLastUpdateDate().toString());
    } catch (SdkLicenseException e) {

      Log.d(TAG, "New license code is required: " + e.getMessage());
      return;
    } catch (WhoCallsSdkException e) {
      Log.d(TAG, e.getMessage());
    }


    Log.i(TAG, "SDK initialization succeeded");
  }

  /**
   * Exposed these method to check the number
   **/
  @ReactMethod
  @SuppressLint("MissingPermission")
  private void checkPhoneNumber(String number, String type) throws WhoCallsSdkException, SdkLicenseViolationException {
    ReactContext rContext = getReactApplicationContext();
    Updater updater = Updater.getInstance();
    WhoCallsSdkManager whoCallsSdk = WhoCallsSdkFactory.getWhoCallsSdkManager();
    Context context = Objects.requireNonNull(getCurrentActivity()).getApplicationContext();
    final File basesPath = Objects.requireNonNull(getCurrentActivity()).getApplicationContext()
            .getDir("bases", Context.MODE_PRIVATE);
    WhoCallsSdkInitParams params = new WhoCallsSdkInitParamsBuilder(basesPath).build();
    /** Initialize the SDK */
    if (whoCallsSdk == null) WhoCallsSdkFactory.initializeWhoCallsSdk(context, params);

    /** Update the SDK Database*/
    updater.updateAllBases((i, i1) -> false);
    Log.d(TAG, "In check number");
    whoCallsSdk.updateOfflineBases(offlineBasesUpdateResult -> Log.d(TAG, offlineBasesUpdateResult.toString()));
    /** Checking the phone reputation */
    PhoneNumber phoneNumber = new PhoneNumberBuilder().setE164PhoneNumber(number).build();
    DatabasePhoneInfo info;
    if (Objects.equals(type, "cloud"))
      try {
        info = whoCallsSdk.requestPhoneNumberInfoFromCloud(phoneNumber);
        Log.d(TAG, "Info cloud: " + info);
      } catch (DatabasePhoneInfoException e) {
        e.printStackTrace();
      }
    else {
      info = (DatabasePhoneInfo) whoCallsSdk.requestPhoneBookInfo(phoneNumber);
      Log.d(TAG, "Info local: " + info.getSource().name());
    }
  }


  @ReactMethod
  private void addNumbersInfo(String number) throws WhoCallsSdkException, SdkLicenseViolationException {
    ReactContext rContext = getReactApplicationContext();
    Updater updater = Updater.getInstance();
    WhoCallsSdkManager whoCallsSdk = WhoCallsSdkFactory.getWhoCallsSdkManager();
    Context context = Objects.requireNonNull(getCurrentActivity()).getApplicationContext();
    /** Initialize the SDK */
    final File basesPath = Objects.requireNonNull(getCurrentActivity()).getApplicationContext()
            .getDir("bases", Context.MODE_PRIVATE);
    WhoCallsSdkInitParams params = new WhoCallsSdkInitParamsBuilder(basesPath).build();
    if (whoCallsSdk == null) WhoCallsSdkFactory.initializeWhoCallsSdk(context, params);


    /** Update the SDK Database*/
    updater.updateAllBases((i, i1) -> false);
    Log.d(TAG, "In check number");
    whoCallsSdk.updateOfflineBases(offlineBasesUpdateResult -> Log.d(TAG, offlineBasesUpdateResult.toString()));
    PhoneNumber phoneNumber = new PhoneNumberBuilder().setE164PhoneNumber(number).build();
//    whoCallsSdkManager.getCustomNumberListManager().addOrUpdateCustomPhoneInfo(phoneNumber, info);

  }

  @ReactMethod
  private void updateDatabase() throws SdkLicenseViolationException, WhoCallsSdkException {
    ReactContext rContext = getReactApplicationContext();
    Updater updater = Updater.getInstance();
    WhoCallsSdkManager whoCallsSdk = WhoCallsSdkFactory.getWhoCallsSdkManager();
    Context context = Objects.requireNonNull(getCurrentActivity()).getApplicationContext();
    final File basesPath = Objects.requireNonNull(getCurrentActivity()).getApplicationContext()
            .getDir("bases", Context.MODE_PRIVATE);
    WhoCallsSdkInitParams params = new WhoCallsSdkInitParamsBuilder(basesPath).build();
    if (whoCallsSdk == null)
      WhoCallsSdkFactory.initializeWhoCallsSdk(context, params);

    updater.updateAllBases((i, i1) -> false);
    Log.d(TAG, "In check number");
    sendEvent(rContext, "updateStatus", "true");
    whoCallsSdk.updateOfflineBases(offlineBasesUpdateResult -> Log.d(TAG, offlineBasesUpdateResult.toString()));
  }

  @ReactMethod
  private void reportSpam(String number, Boolean isSpam, @Nullable String comment)
          throws SdkLicenseViolationException, WhoCallsSdkException {
    ReactContext rContext = getReactApplicationContext();
    Updater updater = Updater.getInstance();
    WhoCallsSdkManager whoCallsSdk = WhoCallsSdkFactory.getWhoCallsSdkManager();
    Context context = Objects.requireNonNull(getCurrentActivity()).getApplicationContext();
    final File basesPath = Objects.requireNonNull(getCurrentActivity()).getApplicationContext()
            .getDir("bases", Context.MODE_PRIVATE);
    Log.d(TAG, "The text from params are: " + number + isSpam + comment);
    WhoCallsSdkInitParams params = new WhoCallsSdkInitParamsBuilder(basesPath).build();

    if (whoCallsSdk == null) {
      WhoCallsSdkFactory.initializeWhoCallsSdk(context, params);
    }


    updater.updateAllBases((i, i1) -> false);
    Log.d(TAG, "In check number");
    sendEvent(rContext, "updateStatus", "true");
    whoCallsSdk.updateOfflineBases(offlineBasesUpdateResult -> Log.d(TAG, offlineBasesUpdateResult.toString()));

    assert comment != null;
    if (comment.length() > 1000) {
      sendEvent(rContext, "Status", "false");
      return;
    }
    /** Adding the number to the report section*/
    PhoneNumber phoneNumber = new PhoneNumberBuilder().setE164PhoneNumber(number).build();
    whoCallsSdk.reportNumber(phoneNumber, isSpam, comment);
    sendEvent(rContext, "Status", "true");
  }

  @ReactMethod
  private void getPhoneInformation(String number) throws WhoCallsSdkException {
    ReactContext rContext = getReactApplicationContext();
    Updater updater = Updater.getInstance();
    WhoCallsSdkManager whoCallsSdk = WhoCallsSdkFactory.getWhoCallsSdkManager();
    Context context = Objects.requireNonNull(getCurrentActivity()).getApplicationContext();
    final File basesPath = Objects.requireNonNull(getCurrentActivity()).getApplicationContext()
            .getDir("bases", Context.MODE_PRIVATE);
    WhoCallsSdkInitParams params = new WhoCallsSdkInitParamsBuilder(basesPath).build();

    if (whoCallsSdk == null)
      WhoCallsSdkFactory.initializeWhoCallsSdk(context, params);

    PhoneNumber testPhoneNumber = new PhoneNumberBuilder()
            .setE164PhoneNumber(number)
            .build();
    CustomPhoneInfo info = new CustomPhoneInfoBuilder(testPhoneNumber)
            .setLabel("Some test information") // Any String
            .addCategory("My category") // Actually, any String, too
            .build();

    CustomNumberListManager cnlm = whoCallsSdk.getCustomNumberListManager();
    cnlm.addOrUpdateCustomPhoneInfo(testPhoneNumber, info);

    //Both(!) will return custom DB information about the number
    // whoCallsSdk.requestPhoneNumberInfoFromCloud(testPhoneNumber);
    whoCallsSdk.requestPhoneNumberInfoFromOfflineDatabase(testPhoneNumber);
  }


  private void sendEvent(ReactContext reactContext, String eventName, @Nullable String message) {
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, message);
  }


}

