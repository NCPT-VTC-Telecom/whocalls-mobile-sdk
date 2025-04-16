import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Text,
} from 'react-native';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import {TextInput} from 'react-native-paper';
import {Button} from '@rneui/themed';
import WhoCallsSDK from 'react-native-who-calls';
import {images} from '../../assets';
import {isEmail, isPhoneNumber} from '../../helpers';

interface IState {
  text: string;
  type: 'phone' | 'email';
}

const CheckInformation = () => {
  const styles = createStyles();
  const [state, setState] = useState<IState>({text: '', type: 'phone'});

  useEffect(() => {
    initialiseSDK();
    if (Platform.OS === 'android') {
      checkPhoneStatePermission();
    }
  }, []);

  const checkPhoneStatePermission = async () => {
    if (Platform.OS !== 'android') {
      Alert.alert(
        'Not Supported',
        'This feature is only available on Android devices.',
      );
      return;
    }

    const result = await check(PERMISSIONS.ANDROID.READ_PHONE_STATE);
    if (result === RESULTS.DENIED) {
      const requestResult = await request(PERMISSIONS.ANDROID.READ_PHONE_STATE);
      if (requestResult !== RESULTS.GRANTED) {
        Alert.alert(
          'Permission Denied',
          'The app requires access to phone state to function properly.',
          [
            {
              text: 'Grant Permission',
              onPress: async () => {
                const requestResult = await request(
                  PERMISSIONS.ANDROID.READ_PHONE_STATE,
                );
                if (requestResult !== RESULTS.GRANTED) {
                  Alert.alert(
                    'Permission Still Denied',
                    'You need to enable the permission from the settings.',
                  );
                }
              },
            },
            {text: 'Cancel', style: 'cancel'},
          ],
        );
      }
    } else if (result === RESULTS.BLOCKED) {
      Alert.alert('Permission Blocked', 'Please enable it from the settings.');
    }
  };
  /** This function need to be update at the first  */
  const initialiseSDK = async () => {
    try {
      const result = await WhoCallsSDK.onCreate();
      console.log('SDK Initialized:', result);
    } catch (error) {
      console.error('SDK Initialization Error:', error);
    }
  };

  const handleCheckNumber = (type: 'cloud' | 'local') => async () => {
    if (!validateInput()) return;

    try {
      const result = await WhoCallsSDK.checkNumber(state.text, type);
      console.log(`${type} Check Result:`, result);
    } catch (error) {
      console.error(`${type} Check Error:`, error);
    }
  };

  const handleGetPhoneInfo = async () => {
    if (!validateInput()) return;

    try {
      const result = await WhoCallsSDK.getPhoneNumberInformation(state.text);
      console.log('Phone Info:', result);
    } catch (error) {
      console.error('Phone Info Error:', error);
    }
  };

  const handleInputChange = (value: string) =>
    setState(prev => ({...prev, text: value}));

  const handleTypeChange = (type: 'phone' | 'email') => () =>
    setState({text: '', type});

  const validateInput = () => {
    if (state.type === 'phone') return isPhoneNumber(state.text);
    if (state.type === 'email') return isEmail(state.text);
    return false;
  };

  const renderValidationError = () => {
    if (!state.text) return null;

    const isValid = validateInput();
    if (isValid) return null;

    const errorMessage =
      state.type === 'phone'
        ? 'Số điện thoại không hợp lệ, vui lòng nhập lại'
        : 'Email không hợp lệ, vui lòng nhập lại';

    return <Text style={styles.errorText}>{errorMessage}</Text>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={images.logo} style={styles.image} />
        <Text style={styles.title}>
          {state.type === 'phone' ? 'Kiểm tra số điện thoại' : 'Kiểm tra email'}
        </Text>
        <Text style={styles.description}>
          {state.type === 'phone'
            ? 'Hãy nhập vào số điện thoại để có thể kiểm tra thông tin số điện thoại'
            : 'Hãy nhập vào email để có thể kiểm tra thông tin email'}
        </Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder={
          state.type === 'phone' ? 'Nhập số điện thoại' : 'Nhập email'
        }
        placeholderTextColor="lightgray"
        keyboardType={state.type === 'phone' ? 'number-pad' : 'default'}
        label={state.type === 'phone' ? 'Số điện thoại' : 'Email'}
        value={state.text}
        onChangeText={handleInputChange}
        disableFullscreenUI
      />
      {renderValidationError()}
      <View style={styles.buttonContainer}>
        <Button
          onPress={handleCheckNumber('cloud')}
          containerStyle={styles.button}
          disabled={!validateInput()}
          title="Kiểm tra Cloud"
        />
        <Button
          onPress={handleGetPhoneInfo}
          containerStyle={styles.button}
          disabled={!validateInput()}
          title="Kiểm tra Local"
        />
      </View>
      <TouchableOpacity
        style={styles.switchButton}
        onPress={handleTypeChange(state.type === 'phone' ? 'email' : 'phone')}>
        <Text style={styles.switchLabel}>
          {state.type === 'phone'
            ? 'Kiểm tra thông tin email'
            : 'Kiểm tra thông tin số điện thoại'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CheckInformation;

const createStyles = () =>
  StyleSheet.create({
    container: {padding: 16, gap: 16, flex: 1, justifyContent: 'center'},
    image: {width: 200, height: 200},
    title: {fontSize: 25, fontWeight: '700', textAlign: 'center'},
    titleContainer: {alignItems: 'center'},
    description: {textAlign: 'center'},
    input: {backgroundColor: 'white'},
    errorText: {color: 'red'},
    buttonContainer: {flexDirection: 'row', gap: 8},
    button: {flex: 1},
    switchButton: {
      justifyContent: 'center',
      borderRadius: 8,
      alignItems: 'center',
    },
    switchLabel: {textAlign: 'center', color: 'navy', fontWeight: '700'},
  });
