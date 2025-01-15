import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';

import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import React from 'react';
import {images} from '../../assets';
import Text from '../../components/Text';
import {Button, TextInput} from 'react-native-paper';
import {isEmail, isPhoneNumber} from '../../helpers';

import WhoCallsSDK from 'react-native-who-calls';

import AntDesign from 'react-native-vector-icons/AntDesign';

interface IState {
  text: string;
  type: 'phone' | 'email';
}

const CheckInformation = () => {
  const styles = createStyles();
  const [state, setState] = React.useState<IState>({
    text: '',
    type: 'phone',
  });

  React.useEffect(() => {
    initialiseSDK();
    checkPhoneStatePermission();
  }, []);

  const checkPhoneStatePermission = async () => {
    if (Platform.OS === 'android') {
      // Check the permission status
      const result = await check(PERMISSIONS.ANDROID.READ_PHONE_STATE);

      if (result === RESULTS.GRANTED) {
        // Alert.alert(
        //   'Permission Already Granted',
        //   'You already have permission to manage phone calls.',
        // );
      } else if (result === RESULTS.DENIED) {
        // Request the permission
        const requestResult = await request(
          PERMISSIONS.ANDROID.READ_PHONE_STATE,
        );

        if (requestResult === RESULTS.GRANTED) {
          // Alert.alert('Permission Granted', 'You can now manage phone calls.');
        } else {
          // Alert.alert(
          //   'Permission Denied',
          //   'You need to allow this permission to manage phone calls.',
          // );
        }
      } else if (result === RESULTS.BLOCKED) {
        // Alert.alert(
        //   'Permission Blocked',
        //   'Permission has been blocked. Please enable it from the settings.',
        // );
      }
      return result;
    } else {
      Alert.alert(
        'Not Supported',
        'This feature is only available on Android devices.',
      );
      return false;
    }
  };

  const onChangeText = (value: string) => {
    setState(s => ({...s, text: value}));
  };

  const initialiseSDK = async () => {
    try {
      const result = await WhoCallsSDK.onCreate();
      console.log('result', result);
    } catch (error) {
      console.log('error', error);
    }
  };

  const checkNumber = (type: 'cloud' | 'local') => async () => {
    try {
      if (state.type === 'phone' && !isPhoneNumber(state.text)) {
        return;
      }
      if (state.type === 'email' && !isEmail(state.text)) {
        return;
      }
      const result = await WhoCallsSDK.checkNumber(state.text, type);
      console.log('result', result);
    } catch (error) {
      console.log('error', error);
    }
  };

  const onChangeType = (value: 'phone' | 'email') => () => {
    setState(s => ({...s, text: '', type: value}));
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={images.logo} style={styles.image} />
        <Text style={styles.title} variant="h2">
          {state.type === 'phone' ? 'Kiểm tra số điện thoại' : 'Kiểm tra email'}
        </Text>
        <Text style={{textAlign: 'center'}}>
          {state.type === 'phone'
            ? 'Hãy nhập vào số điện thoại để có thể kiểm tra thông tin số điện thoại'
            : 'Hãy nhập vào email để có thể kiểm tra thông tin email'}
        </Text>
      </View>

      <TextInput
        style={{backgroundColor: 'white'}}
        placeholder={
          state.type === 'phone' ? 'Nhập số điện thoại' : 'Nhập email'
        }
        placeholderTextColor={'lightgray'}
        keyboardType={state.type === 'phone' ? 'number-pad' : 'default'}
        label={state.type === 'phone' ? 'Số điện thoại' : 'Email'}
        value={state.text}
        onChangeText={onChangeText}
        disableFullscreenUI
      />
      {!!state?.text &&
        state.type === 'phone' &&
        !isPhoneNumber(state.text) && (
          <Text style={{color: 'red'}}>
            {'Số điện thoại không hợp lệ, vui lòng nhập lại'}
          </Text>
        )}
      {!!state?.text && state.type === 'email' && !isEmail(state.text) && (
        <Text style={{color: 'red'}}>
          {'Email không hợp lệ, vui lòng nhập lại'}
        </Text>
      )}
      <View style={{flexDirection: 'row', gap: 8}}>
        <Button
          mode="contained"
          onPress={checkNumber('cloud')}
          buttonColor="#00A88E"
          style={{borderRadius: 8, flex: 1}}
          icon={() => <AntDesign name="cloud" size={20} color="white" />}
          disabled={
            !state.text ||
            (state.type === 'phone' && !isPhoneNumber(state.text)) ||
            (state.type === 'email' && !isEmail(state.text))
          }>
          <Text style={{color: 'white'}}>Kiểm tra Cloud</Text>
        </Button>
        <Button
          mode="contained"
          onPress={checkNumber('local')}
          buttonColor="#00A88E"
          style={{borderRadius: 8, flex: 1}}
          icon={() => <AntDesign name="search1" size={20} color="white" />}
          disabled={
            !state.text ||
            (state.type === 'phone' && !isPhoneNumber(state.text)) ||
            (state.type === 'email' && !isEmail(state.text))
          }>
          <Text style={{color: 'white'}}>Kiểm tra thường</Text>
        </Button>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={onChangeType(state.type === 'phone' ? 'email' : 'phone')}>
        <Text style={styles.label}>
          {state.type === 'phone'
            ? 'Kiểm tra thông tin email'
            : 'Kiểm tra thông tin số điện thoại '}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CheckInformation;

const createStyles = () => {
  return StyleSheet.create({
    container: {
      padding: 16,
      gap: 16,
      flex: 1,
      justifyContent: 'center',
    },
    image: {
      width: 200,
      height: 200,
    },
    title: {fontSize: 25, fontWeight: '700', textAlign: 'center'},
    titleContainer: {alignItems: 'center'},
    button: {
      justifyContent: 'center',
      // marginVertical: 4,
      borderRadius: 8,
      alignItems: 'center',
    },
    label: {
      textAlign: 'center',
      color: 'navy',
      fontWeight: '700',
    },
  });
};
