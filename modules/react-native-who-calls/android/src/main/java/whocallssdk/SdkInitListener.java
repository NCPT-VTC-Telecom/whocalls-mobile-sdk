package whocallssdk;

public interface SdkInitListener {
    void onInitializationFailed(String reason);

    void onSdkInitialized();

    void log(String sdkAlreadyInitialized);
}

