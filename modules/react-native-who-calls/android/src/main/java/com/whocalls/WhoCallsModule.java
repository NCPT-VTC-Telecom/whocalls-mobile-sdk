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
import com.kaspersky.whocalls.externalapi.OfflineBasesUpdateResult;
import com.kaspersky.whocalls.externalapi.PhoneNumber;
import com.kaspersky.whocalls.externalapi.PhoneNumberBuilder;
import com.kaspersky.whocalls.externalapi.UpdateListener;
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

import whocallssdk.MainActivityCallback;
import whocallssdk.SdkInitListener;


public class WhoCallsModule extends ReactContextBaseJavaModule {

  public String TAG = "WhoCalls Started";
  private volatile InitStatus mSdkInitStatus = InitStatus.NotInited;

  public WhoCallsModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @NonNull
  public String getName() {
    return "WhoCallSDK";
  }


  /**
   * Create and intitalize the SDK to function properly
   **/
  @ReactMethod
  public void onCreate() {

    MainActivityCallback listener;
    new Thread(new Runnable() {
      @Override
      public void run() {
        initializeSdk();
      }
    }).start();
  }

  /**
   * Initialize SDK for using the WhoCalls
   */
  private void initializeSdk() {
    SdkInitListener listener = null;
    Log.i(TAG, "SDK initialization started");
    final File basesPath = getCurrentActivity().getDir("bases", Context.MODE_PRIVATE);

    if (KavSdk.isInitialized()) {
      listener.log("SDK already initialized");
      return;
    }


    MainActivityCallback mExtListener = (MainActivityCallback) listener;
    try {
      WhoCallsSdkInitParams params = new WhoCallsSdkInitParamsBuilder(basesPath)
              //.setForegroundRequest(foregroundRequest)
              .build();
      WhoCallsSdkManager whoCallsSdk = WhoCallsSdkFactory.getWhoCallsSdkManager();
      if (whoCallsSdk == null) {
        whoCallsSdk = WhoCallsSdkFactory.initializeWhoCallsSdk(getCurrentActivity().getApplicationContext(), params);
      }


      SdkLicense license = WhoCallsSdkFactory.getLicense();

      if (!license.isValid()) {

        license.activate(null);
      }
      Log.d(TAG, String.valueOf(license.isValid()));
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

//    listener.onSdkInitialized();
    Log.i(TAG, "SDK initialization succeeded");
  }

  /**
   * Exposed these method to check the number
   **/
  @ReactMethod
  @SuppressLint("MissingPermission")
  private void checkPhoneNumber(String number, String type) throws WhoCallsSdkException, SdkLicenseViolationException {
    final File basesPath = Objects.requireNonNull(getCurrentActivity()).getApplicationContext().getDir("bases", Context.MODE_PRIVATE);

    /** Initialize the SDK */
    WhoCallsSdkInitParams params = new WhoCallsSdkInitParamsBuilder(basesPath)
            .build();
    WhoCallsSdkManager whoCallsSdk = WhoCallsSdkFactory.getWhoCallsSdkManager();
    if (whoCallsSdk == null) {
      WhoCallsSdkFactory.initializeWhoCallsSdk(getCurrentActivity().getApplicationContext(), params);
    }
    WhoCallsSdkManager whoCallsSdkManager = WhoCallsSdkFactory.getWhoCallsSdkManager();

    /** Update the SDK Database*/
    Updater updater = Updater.getInstance();
    updater.updateAllBases((i, i1) -> false);
    Log.d(TAG, "In check number");
    whoCallsSdkManager.updateOfflineBases(new UpdateListener() {
      @Override
      public void onResult(OfflineBasesUpdateResult offlineBasesUpdateResult) {
        Log.d(TAG, offlineBasesUpdateResult.toString());
      }
    });
    /** Checking the phone reputation */
    PhoneNumber phoneNumber = new PhoneNumberBuilder().setE164PhoneNumber(number).build();
    DatabasePhoneInfo info;
    if (Objects.equals(type, "cloud"))
      try {
        info = whoCallsSdkManager.requestPhoneNumberInfoFromCloud(phoneNumber);
        Log.d(TAG, "Info cloud: " + info);
      } catch (DatabasePhoneInfoException e) {
        e.printStackTrace();
      }
    else {

      info = (DatabasePhoneInfo) whoCallsSdkManager.requestPhoneBookInfo(phoneNumber);
      Log.d(TAG, "Info local: " + info.getSource().name());
    }
  }


  @ReactMethod
  private void addNumbersInfo(String number) throws WhoCallsSdkException, SdkLicenseViolationException {
    final File basesPath = Objects.requireNonNull(getCurrentActivity()).getApplicationContext().getDir("bases", Context.MODE_PRIVATE);
    /** Initialize the SDK */
    WhoCallsSdkInitParams params = new WhoCallsSdkInitParamsBuilder(basesPath)
            .build();
    WhoCallsSdkManager whoCallsSdk = WhoCallsSdkFactory.getWhoCallsSdkManager();
    if (whoCallsSdk == null) {
      WhoCallsSdkFactory.initializeWhoCallsSdk(Objects.requireNonNull(getCurrentActivity()).getApplicationContext(), params);
    }
    WhoCallsSdkManager whoCallsSdkManager = WhoCallsSdkFactory.getWhoCallsSdkManager();
    /** Update the SDK Database*/
    Updater updater = Updater.getInstance();
    updater.updateAllBases((i, i1) -> false);
    Log.d(TAG, "In check number");
    whoCallsSdkManager.updateOfflineBases(new UpdateListener() {
      @Override
      public void onResult(OfflineBasesUpdateResult offlineBasesUpdateResult) {
        Log.d(TAG, offlineBasesUpdateResult.toString());
      }
    });
    PhoneNumber phoneNumber = new PhoneNumberBuilder().setE164PhoneNumber(number).build();
//    whoCallsSdkManager.getCustomNumberListManager().addOrUpdateCustomPhoneInfo(phoneNumber, info);

  }

  @ReactMethod
  private void updateDatabase() throws SdkLicenseViolationException, WhoCallsSdkException {
    final File basesPath = Objects.requireNonNull(getCurrentActivity()).getApplicationContext().getDir("bases", Context.MODE_PRIVATE);
    WhoCallsSdkInitParams params = new WhoCallsSdkInitParamsBuilder(basesPath)
            .build();
    WhoCallsSdkManager whoCallsSdk = WhoCallsSdkFactory.getWhoCallsSdkManager();
    if (whoCallsSdk == null) {
      WhoCallsSdkFactory.initializeWhoCallsSdk(Objects.requireNonNull(getCurrentActivity()).getApplicationContext(), params);
    }
    WhoCallsSdkManager whoCallsSdkManager = WhoCallsSdkFactory.getWhoCallsSdkManager();
    Updater updater = Updater.getInstance();
    updater.updateAllBases((i, i1) -> false);
    Log.d(TAG, "In check number");
    sendEvent(getReactApplicationContext(), "updateStatus", "true");
    whoCallsSdkManager.updateOfflineBases(new UpdateListener() {
      @Override
      public void onResult(OfflineBasesUpdateResult offlineBasesUpdateResult) {

        Log.d(TAG, offlineBasesUpdateResult.toString());
      }
    });
  }

  @ReactMethod
  private void reportSpam(String number, Boolean isSpam, @Nullable String comment)
          throws SdkLicenseViolationException, WhoCallsSdkException {
    Log.d(TAG, "The text from params are: " + number + isSpam + comment);
    final File basesPath = Objects.requireNonNull(getCurrentActivity()).getApplicationContext()
            .getDir("bases", Context.MODE_PRIVATE);
    WhoCallsSdkInitParams params =
            new WhoCallsSdkInitParamsBuilder(basesPath)
                    .build();
    WhoCallsSdkManager whoCallsSdk =
            WhoCallsSdkFactory.getWhoCallsSdkManager();
    if (whoCallsSdk == null) {
      WhoCallsSdkFactory.initializeWhoCallsSdk(
              Objects.requireNonNull(getCurrentActivity()).getApplicationContext(), params);
    }
    WhoCallsSdkManager whoCallsSdkManager = WhoCallsSdkFactory.getWhoCallsSdkManager();

    Updater updater = Updater.getInstance();
    updater.updateAllBases((i, i1) -> false);
    Log.d(TAG, "In check number");
    sendEvent(getReactApplicationContext(), "updateStatus", "true");
    whoCallsSdkManager.updateOfflineBases(offlineBasesUpdateResult -> Log.d(TAG, offlineBasesUpdateResult.toString()));

    assert comment != null;
    if (comment.length() > 1000) {

      sendEvent(getReactApplicationContext(), "Status", "false");
      return;
    }
    /** Adding the number to the report section*/
    PhoneNumber phoneNumber = new PhoneNumberBuilder().setE164PhoneNumber(number).build();
    whoCallsSdkManager.reportNumber(phoneNumber, isSpam, comment);
    sendEvent(getReactApplicationContext(), "Status", "true");
  }

  @ReactMethod
  private void getPhoneInformation(String number) throws SdkLicenseViolationException, WhoCallsSdkException {
    final File basesPath = Objects.requireNonNull(getCurrentActivity()).getApplicationContext()
            .getDir("bases", Context.MODE_PRIVATE);
    WhoCallsSdkInitParams params =
            new WhoCallsSdkInitParamsBuilder(basesPath)
                    .build();
    WhoCallsSdkManager whoCallsSdk =
            WhoCallsSdkFactory.getWhoCallsSdkManager();
    if (whoCallsSdk == null) {
      WhoCallsSdkFactory.initializeWhoCallsSdk(
              Objects.requireNonNull(getCurrentActivity()).getApplicationContext(), params);
    }
    WhoCallsSdkManager whoCallsSdkManager = WhoCallsSdkFactory.getWhoCallsSdkManager();
    PhoneNumber testPhoneNumber = new PhoneNumberBuilder()
            .setE164PhoneNumber(number)
            .build();
    CustomPhoneInfo info = new CustomPhoneInfoBuilder(testPhoneNumber)
            .setLabel("Some test information") // Any String
            .addCategory("My category") // Actually, any String, too
            .build();

    CustomNumberListManager cnlm = whoCallsSdkManager.getCustomNumberListManager();
    cnlm.addOrUpdateCustomPhoneInfo(testPhoneNumber, info);

    //Both(!) will return custom DB information about the number
//      whoCallsSdkManager.requestPhoneNumberInfoFromCloud(testPhoneNumber);
    whoCallsSdkManager.requestPhoneNumberInfoFromOfflineDatabase(testPhoneNumber);
  }


  private void onInitializationFailed(InitStatus initStatus, String s) {
  }

  private void sendEvent(ReactContext reactContext, String eventName, @Nullable String message) {
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, message);
  }

  private enum InitStatus {
    NotInited,
    InitInProgress,
    InitedSuccesfully,
    InsufficientPermissions,
    NeedNewLicenseCode,
    InitAntivirusFailed,
    InitFailed;

    public static boolean isError(InitStatus initStatus) {
      return initStatus != NotInited &&
              initStatus != InitInProgress &&
              initStatus != InitedSuccesfully;
    }
  }
}

