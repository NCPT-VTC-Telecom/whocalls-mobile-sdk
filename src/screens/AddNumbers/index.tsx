import {View, Image, StyleSheet, KeyboardAvoidingView} from 'react-native';
import React from 'react';
import {images} from '../../assets';
import Text from '../../components/Text';
import {Chip, Switch, TextInput} from 'react-native-paper';
import {Button} from '@rneui/themed';
import {isPhoneNumber} from '../../helpers';

import WhoCalls from 'react-native-who-calls';

import AntDesign from 'react-native-vector-icons/AntDesign';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';

interface IState {
  text: string;
  type: boolean;

  comments: string;
}

const AddNumbers = () => {
  const styles = createStyles();
  const [state, setState] = React.useState<IState>({
    text: '',
    type: false,
    comments: '',
  });

  const onChangeText = (value: string) => {
    setState(s => ({...s, text: value}));
  };

  const onChangeType = () => {
    setState(s => ({...s, type: !s.type, spamList: []}));
  };

  const onChangeComments = (value: string) => {
    setState(s => ({...s, comments: value}));
  };

  const handleAddSpam = async () => {
    try {
      await WhoCalls.reportSpamNumber(state.text, state.type, state.comments);
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Thêm thành công',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Thêm số điện thoại thất bại',
      });
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={images.logo} style={styles.image} />
        <Text style={styles.title} variant="h2">
          Thêm số điện thoại
        </Text>
        <Text style={{textAlign: 'center', color: 'gray'}}>
          Hãy nhập vào số điện thoại để có thể thêm thông tin số điện thoại
        </Text>
      </View>

      <TextInput
        style={{backgroundColor: 'white', marginTop: 16}}
        placeholder={'Nhập số điện thoại'}
        placeholderTextColor={'lightgray'}
        keyboardType={'number-pad'}
        label={'Số điện thoại'}
        value={state.text}
        onChangeText={onChangeText}
        disableFullscreenUI
      />
      {!!state?.text && !isPhoneNumber(state.text) && (
        <Text style={{color: 'red'}}>{'Số điện thoại không hợp lệ '}</Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 16,
        }}>
        <Text style={{flex: 1}}>Có phải hạng mục rác?</Text>
        <Switch value={state.type} onChange={onChangeType} />
      </View>

      {state?.type === true && (
        <KeyboardAvoidingView style={{gap: 8, flex: 1}}>
          <Text style={{fontWeight: '700', fontSize: 15}}>
            Thêm thông tin cho hạng mục spam hoặc rác
          </Text>
          <View style={{flexWrap: 'wrap', flexDirection: 'row', gap: 8}}>
            <TextInput
              value={state?.comments}
              onChangeText={onChangeComments}
              style={{height: 100, backgroundColor: 'white', flex: 1}}
              multiline
              placeholder={'Nhập thông tin'}
            />
          </View>
        </KeyboardAvoidingView>
      )}
      <Button
        onPress={handleAddSpam}
        containerStyle={{marginVertical: 16}}
        title={'Thêm vào danh sách'}
      />
    </KeyboardAwareScrollView>
  );
};

export default AddNumbers;

const createStyles = () => {
  return StyleSheet.create({
    container: {
      padding: 16,
      gap: 16,
      // alignItems: 'center',
      // justifyContent: 'center',
    },
    image: {
      width: 200,
      height: 200,
    },
    title: {fontSize: 25, fontWeight: '700'},
    button: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 8,
      borderRadius: 8,
    },
    label: {textAlign: 'center', color: 'white'},
    titleContainer: {
      alignItems: 'center',
    },
  });
};
