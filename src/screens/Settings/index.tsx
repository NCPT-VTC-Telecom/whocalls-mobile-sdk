import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';

import {Avatar} from '@rneui/themed';
import OptionsList from './Options';
import {color} from '@rneui/base';

import Text from '../../components/Text';
import {StackScreenProps} from '@react-navigation/stack';

const Settings: React.FC<StackScreenProps<any>> = ({navigation}) => {
  const onPremium = () => {
    Alert.alert('Nâng cấp Premium', 'Bạn có muốn nâng cấp Premium không?');
  };

  const DATA_ROUTING = [
    {
      name: 'Cập nhật cơ sở dữ liệu',
      icon: 'database',
      color: '#BA3F1D',
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
