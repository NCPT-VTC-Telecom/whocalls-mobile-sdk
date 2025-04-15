package com.whocalls;

import android.telecom.Call;
import android.telecom.CallScreeningService;
import android.content.SharedPreferences;

import androidx.annotation.NonNull;

import java.util.Set;
import java.util.HashSet;

public class MyCallScreeningService extends CallScreeningService {
  @Override
  public void onScreenCall(Call.Details callDetails) {
    String phoneNumber = callDetails.getHandle().getSchemeSpecificPart();
    SharedPreferences prefs = getSharedPreferences("SpamList", MODE_PRIVATE);
    Set<String> spamSet = prefs.getStringSet("spamNumbers", new HashSet<>());

    if (spamSet.contains(phoneNumber)) {
      respondToCall(callDetails, new CallResponse.Builder()
              .setDisallowCall(true)
              .setRejectCall(true)
              .setSkipNotification(false)
              .build());

      // Emit event to React Native (if app is active)
      SpamNumberManagerModule module = new SpamNumberManagerModule(null);
      module.emitBlockedCallEvent(phoneNumber);
    } else {
      respondToCall(callDetails, new CallResponse.Builder()
              .setDisallowCall(false)
              .build());
    }
  }
}