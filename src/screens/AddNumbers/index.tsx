import {View, Image, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import {images} from '../../assets';
import Text from '../../components/Text';
import {Button, Chip, TextInput} from 'react-native-paper';
import {isPhoneNumber} from '../../helpers';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface IState {
  text: string;
  type: string;
}

const AddNumbers = () => {
  const styles = createStyles();
  const [state, setState] = React.useState<IState>({
    text: '',
    type: '',
  });

  const onChangeText = (value: string) => {
    setState(s => ({...s, text: value}));
  };

  const onChangeType = (value: string) => () => {
    setState(s => ({...s, type: value}));
  };

  return (
    <View style={styles.container}>
      <View>
        <Image source={images.logo} style={styles.image} />
        <Text style={styles.title} variant="h2">
          Thêm số điện thoại
        </Text>
        <Text>
          Hãy nhập vào số điện thoại để có thể thêm thông tin số điện thoại
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
      <Text>Loại số điện thoại này</Text>
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#FF335C'}]}
          onPress={onChangeType('spam')}>
          <Entypo name="block" size={20} color="white" />
          <Text style={styles.label}>Số rác</Text>
          {state?.type === 'spam' && (
            <FontAwesome
              name="check-circle"
              size={20}
              color="white"
              style={{position: 'absolute', right: 0, top: 0}}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#33C2FF'}]}
          onPress={onChangeType('normal')}>
          <Entypo name="circle-with-plus" size={20} color="white" />
          <Text style={styles.label}>Số bình thường</Text>
          {state?.type === 'normal' && (
            <FontAwesome
              name="check-circle"
              size={20}
              color="white"
              style={{position: 'absolute', right: 0, top: 0}}
            />
          )}
        </TouchableOpacity>
      </View>
      {state?.type === 'spam' && (
        <View>
          <Text>Số điện thoại này thuộc hạng mục nào</Text>
          <View style={{flexWrap: 'wrap', flexDirection: 'row', gap: 8}}>
            <Chip icon="check" onPress={() => {}}>
              Cuộc gọi rác
            </Chip>
            <Chip icon="check" onPress={() => {}}>
              Quảng cáo
            </Chip>
            <Chip icon="check" onPress={() => {}}>
              Lừa đảo
            </Chip>
            <Chip icon="check" onPress={() => {}}>
              Làm phiền
            </Chip>
            <Chip icon="check" onPress={() => {}}>
              Nhá máy
            </Chip>
          </View>
        </View>
      )}
      <Button
        mode="contained"
        onPress={() => {}}
        rippleColor={'lightgray'}
        buttonColor="#00A88E"
        style={{borderRadius: 8}}
        icon={() => <AntDesign name="search1" size={20} color="white" />}>
        <Text style={{color: 'white'}}>Kiểm tra</Text>
      </Button>
    </View>
  );
};

export default AddNumbers;

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
    title: {fontSize: 20, fontWeight: '500'},
    button: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 8,
      borderRadius: 8,
    },
    label: {textAlign: 'center', color: 'white'},
  });
};
