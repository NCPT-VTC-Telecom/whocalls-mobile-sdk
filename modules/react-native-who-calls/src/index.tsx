import {
  NativeModules,
  Platform,
  EmitterSubscription,
  DeviceEventEmitter,
} from 'react-native';

const {WhoCallSDK} = NativeModules;

export const onCreate = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    let result: EmitterSubscription;
    result = DeviceEventEmitter.addListener('Status', data => {
      resolve(data);
      result.remove();
    });

    try {
      WhoCallSDK.onCreate();
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export default {onCreate};
