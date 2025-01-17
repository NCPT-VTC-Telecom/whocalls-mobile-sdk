import {
  FlatList,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {BottomSheet} from '@rneui/themed';
import {Avatar} from '@rneui/base';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Divider from '../../../components/Divider';
import {Button} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface Interface {
  item?: any;
  onPress?: () => void;
  onPressClose?: () => void;
  isVisible?: boolean;
  isSpam?: boolean;
}

const Information: React.FC<Interface> = ({
  item,
  onPressClose,
  onPress,
  isVisible,
  isSpam,
}) => {
  const DATA_ROUTING = [
    {
      name: 'Chặn',
      icon: 'alert-octagon',
      color: 'tomato',
      onPress: () => console.log('block'),
    },
    {
      name: 'Chỉnh sửa',
      icon: 'edit',
      color: 'tomato',
      onPress: () => console.log('block'),
    },
  ];

  if (!isSpam) {
    DATA_ROUTING.push(
      {
        name: 'Gọi',
        icon: 'phone',
        color: '#00A88E',
        onPress: () => Linking.openURL(`tel:${item?.item?.phoneNumber}`),
      },
      {
        name: 'Nhắn tin',
        icon: 'message-circle',
        color: '#335CFF',
        onPress: () => Linking.openURL(`sms:${item?.item?.phoneNumber}`),
      },
    );
  }

  const renderListView = () => {
    return DATA_ROUTING.map(item => (
      <TouchableOpacity style={styles.listItem} onPress={item.onPress}>
        <Feather name={item.icon} size={25} color={item.color} />
        <Text style={styles.text}>{item.name}</Text>
      </TouchableOpacity>
    ));
  };

  const renderLabel = (label: string) => {
    return (
      <View style={{}}>
        <Text
          style={{
            marginRight: 16,
            color: 'white',
            fontSize: 15,
            fontWeight: '500',
            backgroundColor: label === 'spam' ? 'tomato' : 'green',
            paddingHorizontal: 6,
            borderRadius: 8,
          }}>
          {label === 'spam' ? 'Số rác' : 'Số thường'}
        </Text>
      </View>
    );
  };

  const styles = createStyles();
  return (
    <BottomSheet isVisible={isVisible} containerStyle={{}}>
      <View
        style={[
          styles.container,
          {borderTopLeftRadius: 16, borderTopRightRadius: 16},
        ]}>
        <TouchableOpacity style={styles.icon} onPress={onPressClose}>
          <AntDesign name="closecircle" size={30} />
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Avatar
            source={{
              uri: `https://ui-avatars.com/api/?bold=true?format=svg&name=${item?.item?.displayName}&color=random&background=random&rounded=true`,
            }}
            size={100}
          />
          <View style={{gap: 8}}>
            <Text style={styles.title}>Chưa có tên</Text>
            <Text style={styles.phoneNumber}>+84 909 679 250</Text>
          </View>
        </View>

        <Divider />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {renderListView()}
        </View>
        <ScrollView>
          <View style={{flex: 1, gap: 16}}>
            <View
              style={{
                flexDirection: 'row',
                // height: 100,
                justifyContent: 'space-between',
              }}>
              <Text style={styles.description}>Mô tả</Text>
              <Text style={[styles.description, {flex: 1, textAlign: 'right'}]}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.description}>Phân loại</Text>
              <Text style={[styles.description, {textAlign: 'right'}]}>
                Chưa có tên
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.description}>Số điện thoại rác?</Text>
              {renderLabel('spam')}
            </View>
            <Button
              style={{
                marginVertical: 16,
                marginHorizontal: 16,
                bottom: 0,
                backgroundColor: '#00A88E',
                borderRadius: 8,
              }}
              mode="contained">
              <Text>Hoàn thành</Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

export default Information;

const createStyles = () => {
  const bottom = useSafeAreaInsets().bottom;
  return StyleSheet.create({
    container: {
      gap: 8,
      flex: 1,
      backgroundColor: 'white',
      paddingBottom: Math.max(bottom, 16),
    },
    icon: {
      position: 'absolute',
      right: 8,
      top: 8,
      zIndex: 1,
    },
    avatar: {zIndex: 1, marginTop: 50, alignItems: 'center'},
    title: {
      color: 'black',
      fontSize: 25,
      fontWeight: '700',
      textAlign: 'center',
    },
    phoneNumber: {
      color: 'black',
      fontSize: 15,
      fontWeight: '500',
      textAlign: 'center',
    },
    description: {
      color: 'black',
      fontSize: 15,
      fontWeight: '500',
      marginHorizontal: 16,
    },
    listItem: {
      alignItems: 'center',
      paddingHorizontal: 20,
      margin: 8,
    },
    text: {fontSize: 15, textAlign: 'center', fontWeight: '500', marginTop: 8},
  });
};
