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
      name: 'Gửi ý kiến đánh giá',
      description:
        'Mọi đánh giá từ quý khách sẽ giúp chúng tôi cải thiện, nâng cao chất lượng dịch vụ',
      icon: 'message1',
      color: '#80A1C1',
      onPress: () => {
        navigation.navigate('Feedback');
      },
    },
    {
      name: 'Đăng xuất',
      icon: 'logout',
      color: '#BA3F1D',
      onPress: () => {
        Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
          {text: 'Hủy', style: 'cancel'},
          {text: 'Đồng ý', onPress: () => console.log('Logged out')},
        ]);
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
        <View style={{flex: 1, marginLeft: 8}}>
          <Text style={{fontSize: 15, fontWeight: '500'}}>{item?.name}</Text>
          {item?.description && (
            <Text style={{fontSize: 13, color: '#666'}}>
              {item?.description}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Gói Who Calls 6 tháng</Text>
        <Text style={styles.cardText}>Thời gian đăng ký: 01/01/2025</Text>
        <Text style={styles.cardText}>Thời gian hết hạn: 31/05/2025</Text>
        <Text style={styles.cardText}>Mã Key: CL123MD</Text>
      </View>
      <FlatList
        data={DATA_ROUTING}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {padding: 8, flex: 1, backgroundColor: '#F5F5F5'},
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {fontSize: 16, fontWeight: 'bold', marginBottom: 8},
  cardText: {fontSize: 14, color: '#666', marginBottom: 4},
  touchSettings: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 8,
    paddingHorizontal: 12,
    gap: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
