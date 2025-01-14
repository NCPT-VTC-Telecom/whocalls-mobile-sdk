import {View, Image, StyleSheet} from 'react-native';
import React from 'react';
import {images} from '../../assets';
import Text from '../../components/Text';
import {Button, TextInput} from 'react-native-paper';
import {isPhoneNumber} from '../../helpers';

import WhoCallsSDK from 'react-native-who-calls';

import AntDesign from 'react-native-vector-icons/AntDesign';

interface IState {
  text: string;
}

const Home = () => {
  const styles = createStyles();
  const [state, setState] = React.useState<IState>({
    text: '',
  });

  React.useEffect(() => {
    initialiseSDK();
  }, []);

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

  return (
    <View style={styles.container}>
      <View>
        <Image source={images.logo} style={styles.image} />
        <Text style={styles.title} variant="h2">
          Kiểm tra số điện thoại
        </Text>
        <Text>
          Hãy nhập vào số điện thoại để có thể kiểm tra thông tin số điện thoại
        </Text>
      </View>

      <TextInput
        style={{backgroundColor: 'white'}}
        placeholder={'Nhập số điện thoại'}
        placeholderTextColor={'lightgray'}
        keyboardType={'number-pad'}
        label={'Số điện thoại'}
        value={state.text}
        onChangeText={onChangeText}
        disableFullscreenUI
      />
      {!!state?.text && !isPhoneNumber(state.text) && (
        <Text style={{color: 'red'}}>{'Không hợp lệ'}</Text>
      )}
      <Button
        mode="contained"
        onPress={() => {}}
        buttonColor="tomato"
        style={{borderRadius: 8}}
        icon={() => <AntDesign name="search1" size={20} color="white" />}>
        <Text style={{color: 'white'}}>Kiểm tra</Text>
      </Button>
    </View>
  );
};

export default Home;

const createStyles = () => {
  return StyleSheet.create({
    container: {
      padding: 16,
      gap: 16,
    },
    image: {
      width: 200,
      height: 200,
    },
    title: {fontSize: 25, fontWeight: '500'},
  });
};
