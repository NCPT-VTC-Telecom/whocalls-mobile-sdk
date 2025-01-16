import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';

import Toast from 'react-native-toast-message';

import AntDesign from 'react-native-vector-icons/AntDesign';

import {Avatar} from '@rneui/themed';
import OptionsList from './Options';
import {color} from '@rneui/base';

import Text from '../../components/Text';
import {StackScreenProps} from '@react-navigation/stack';

import WhoCallsSDK from 'react-native-who-calls';

const Settings: React.FC<StackScreenProps<any>> = ({navigation}) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const onPremium = () => {
    Alert.alert('Nâng cấp Premium', 'Bạn có muốn nâng cấp Premium không?');
  };

  const updateDatabase = async () => {
    try {
      setLoading(true);
      const response = await WhoCallsSDK.updateDatabase();
      console.log(response);
      setLoading(false);

      Toast.show({
        text1: 'Thành công',
        text2: 'Cập nhật cơ sở dữ liệu thành công',
        type: 'success',
      });
    } catch (error) {
      Toast.show({
        text1: 'Lỗi',
        text2: 'Không thể cập nhật cơ sở dữ liệu',
        type: 'error',
      });
      setLoading(false);
    }
  };

  const DATA_ROUTING = [
    {
      name: 'Cập nhật cơ sở dữ liệu',
      icon: 'database',
      color: '#BA3F1D',
      onPress: updateDatabase,
    },
    {
      name: 'Nâng cấp Premium',
      icon: 'staro',
      color: '#A77E58',
      onPress: onPremium,
    },
    {
      name: 'Tùy chọn hạng mục',
      icon: 'setting',
      color: '#80A1C1',
      onPress: () => {
        navigation.navigate('OptionsList');
      },
    },
  ];

  const renderItem = ({item}: {item: any}) => {
    return (
      <TouchableOpacity style={styles.touchSettings} onPress={item?.onPress}>
        <AntDesign
          name={item?.icon}
          size={24}
          style={{
            backgroundColor: item?.color,
            padding: 8,
            borderRadius: 8,
            color: 'white',
          }}
        />
        <Text style={{fontSize: 15}}>{item?.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          marginTop: 8,
        }}>
        <Avatar
          source={{
            uri: 'https://ui-avatars.com/api/?background=random&rounded=true',
          }}
          size={60}
        />
        <View
          style={{
            marginHorizontal: 8,
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            backgroundColor: 'lightblue',
            paddingHorizontal: 8,
            borderRadius: 8,
          }}>
          <Text style={{fontSize: 20, fontWeight: '500', marginBottom: 0}}>
            Người dùng mới
          </Text>
          <Text style={{fontSize: 13}}>Gói dùng: Basic</Text>
        </View>
      </View>
      <View style={{borderBottomWidth: 0.5, marginVertical: 16}} />
      <FlatList data={DATA_ROUTING} renderItem={renderItem} />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flex: 1,
    // flexDirection: 'row',
    // alignItems: 'center',
  },
  touchSettings: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 8,
    // flex: 1,
    paddingHorizontal: 12,
    gap: 8,

    // justifyContent: 'center',
    // borderBottomWidth: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 4,
  },
});
