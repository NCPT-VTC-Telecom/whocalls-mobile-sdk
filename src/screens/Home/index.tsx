import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {images} from '../../assets';
import {Input} from '@rneui/base';
import {isPhoneNumber} from '../../helpers';

interface IState {
  text: string;
}

const Home = () => {
  const styles = createStyles();
  const [state, setState] = React.useState<IState>({
    text: '',
  });

  const onChangeText = (value: string) => {
    setState(s => ({...s, text: value}));
  };

  return (
    <View style={styles.container}>
      <Image source={images.logo} style={styles.image} />
      <Text style={styles.title}>Kiểm tra số điện thoại</Text>
      <Input
        style={{backgroundColor: 'white'}}
        placeholder={'Nhập số điện thoại'}
        placeholderTextColor={'lightgray'}
        keyboardType={'number-pad'}
        label={'Số điện thoại'}
        value={state.text}
        onChangeText={onChangeText}
        errorMessage={
          isPhoneNumber(state.text) ? 'Không phải số điện thoại' : ''
        }
      />
    </View>
  );
};

export default Home;

const createStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 16,
    },
    image: {
      width: 200,
      height: 200,
    },
    title: {fontSize: 20, fontWeight: '500'},
  });
};
