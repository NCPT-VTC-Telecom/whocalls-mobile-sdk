import {
  NativeModules,
  Platform,
  EmitterSubscription,
  DeviceEventEmitter,
} from 'react-native';

/** Exposed the SDK to initialize the SDK */
export const onCreate = (): Promise<any> => {
  const {WhoCallSDK} = NativeModules;

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

/** Checking the numbers to get label
 * @param number: string
 * @returns Promise<any>
 */
export const checkNumber = (
  number: string,
  type: 'cloud' | 'local',
): Promise<any> => {
  const {WhoCallSDK} = NativeModules;

  return new Promise((resolve, reject) => {
    let result: EmitterSubscription;
    result = DeviceEventEmitter.addListener('Status', data => {
      resolve(data);
      result.remove();
    });

    try {
      WhoCallSDK.checkPhoneNumber(number, type);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const updateDatabase = (): Promise<any> => {
  const {WhoCallSDK} = NativeModules;

  return new Promise((resolve, reject) => {
    let result: EmitterSubscription;
    result = DeviceEventEmitter.addListener('updateStatus', data => {
      resolve(data);
      result.remove();
    });

    try {
      WhoCallSDK.updateDatabase();
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export default {onCreate, checkNumber, updateDatabase};
