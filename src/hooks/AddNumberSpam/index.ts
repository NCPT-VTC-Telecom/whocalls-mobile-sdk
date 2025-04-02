import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CallInformation {
  id: string;
  phoneNumber: string;
  isSpam: boolean;
  time: string;
}

// This file handles the storage and retrieval of call information
const STORAGE_KEY = 'callInformation';

export const getCallInformation = async (): Promise<CallInformation[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error fetching call information:', error);
    return [];
  }
};

export const addCallInformation = async (
  newCall: CallInformation,
): Promise<void> => {
  try {
    const existingData = await getCallInformation();
    const updatedData = [...existingData, newCall];
    const jsonValue = JSON.stringify(updatedData);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving call information:', error);
  }
};
