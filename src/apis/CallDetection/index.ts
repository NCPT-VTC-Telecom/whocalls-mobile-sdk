// CallDetectionBridge.ts
import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  EmitterSubscription,
} from 'react-native';

// Define the interface for the native module
interface CallDetectionInterface {
  startListener(): void;
  stopListener(): void;
}

// Define the shape of callback data
interface CallStateData {
  state: string;
  phoneNumber?: string;
}

// Define callback types
type CallDetectionCallback = (
  callState: 'Cuộc gọi đến' | 'Đang gọi' | 'Đã kết thúc',
  phoneNumber?: string,
) => void;

// Check if the native module exists
const {CallDetection} = NativeModules;

export default class CallDetectorManager {
  private callback: CallDetectionCallback;
  private eventEmitter: NativeEventEmitter | null = null;
  private subscription: EmitterSubscription | null = null;

  constructor(callback: CallDetectionCallback) {
    this.callback = callback;

    if (!CallDetection) {
      console.error('Lỗi không tìm thấy CallDetection module');
      return;
    }

    this.eventEmitter = new NativeEventEmitter(CallDetection as any);
    this.subscription = this.eventEmitter.addListener(
      'callStateUpdated',
      this.handleCallStateUpdated,
    );
  }

  private handleCallStateUpdated = (data: CallStateData): void => {
    if (!this.callback) return;

    if (Platform.OS === 'android') {
      this.handleAndroidCallState(data);
    } else {
      this.handleIosCallState(data);
    }
  };

  private handleAndroidCallState(data: CallStateData): void {
    const {state, phoneNumber} = data;

    switch (state) {
      case 'RINGING':
        this.callback('Cuộc gọi đến', phoneNumber);
        break;
      case 'OFFHOOK':
        this.callback('Đang gọi', phoneNumber);
        break;
      case 'IDLE':
        this.callback('Đã kết thúc', phoneNumber);
        break;
      default:
        break;
    }
  }

  private handleIosCallState(data: CallStateData): void {
    // iOS specific call state handling
    // Implementation details would go here based on CallKit data structure
  }

  public startListener(): void {
    if (CallDetection) {
      CallDetection.startListener();
    }
  }

  public stopListener(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }

    if (CallDetection) {
      CallDetection.stopListener();
    }
  }
}
