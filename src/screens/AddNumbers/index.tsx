import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Animated,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Text} from 'react-native-paper';
import {Avatar, Dialog} from '@rneui/themed';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface CallLog {
  id: string;
  phoneNumber: string;
  isSpam: boolean;
  time: string;
  avatarUrl?: string;
}

const callLogs: CallLog[] = [
  {
    id: '1',
    phoneNumber: '0948641075',
    isSpam: false,
    time: '2023-01-13T10:00:00',
    avatarUrl: '',
  },
  {
    id: '2',
    phoneNumber: '0911335567',
    isSpam: false,
    time: '2023-01-13T09:00:00',
    avatarUrl: '',
  },
  {
    id: '3',
    phoneNumber: '0911335567',
    isSpam: true,
    time: '2023-01-12T09:00:00',
    avatarUrl: '',
  },
];

const CallLogHistory = () => {
  const styles = createStyles();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedCallLog, setSelectedCallLog] = useState<CallLog | null>(null);
  const [callLogInfo, setCallLogInfo] = useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setLoading(false));
    }, [fadeAnim]),
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Toast.show({
        type: 'success',
        text1: 'Làm mới',
        text2: 'Danh sách đã được làm mới.',
      });
    }, 2000);
  }, []);

  const renderCallLog = ({item}: {item: CallLog}) => {
    const formattedTime = moment(item.time).format('HH:mm');

    return (
      <TouchableOpacity
        style={styles.callLogContainer}
        onPress={handlePressItem(item)}>
        {item.isSpam ? (
          <MaterialCommunityIcons name="phone-minus" size={24} color="red" />
        ) : (
          <MaterialCommunityIcons
            name="phone-incoming"
            size={24}
            color="green"
          />
        )}
        <View style={styles.callDetails}>
          <Text
            style={[
              styles.phoneNumber,
              {color: item.isSpam ? 'red' : 'black'},
            ]}>
            {item.phoneNumber}
          </Text>
          <Text style={styles.spamStatus}>
            {item.isSpam
              ? 'Đã có khiếu nại về spam'
              : 'Không có khiếu nại về spam'}
          </Text>
        </View>
        <Text style={styles.time}>{formattedTime}</Text>
      </TouchableOpacity>
    );
  };

  const handlePressItem = (item: CallLog) => () => {
    setSelectedCallLog(item);
    setCallLogInfo(true);
  };

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      <View style={styles.searchBar}>
        <MaterialCommunityIcons
          name="magnify"
          size={24}
          color="white"
          style={styles.searchIcon}
        />

        <TextInput
          style={styles.searchPlaceholder}
          placeholder="Tìm kiếm cuộc gọi"
        />

        <Avatar
          rounded
          size={32}
          icon={{name: 'bars', type: 'font-awesome'}}
          containerStyle={styles.menuIcon}
          onPress={() => setModalVisible(true)}
        />
        <Dialog
          isVisible={modalVisible}
          transparent={true}
          animationType="fade"
          onBackdropPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text
                style={styles.modalOption}
                onPress={() => setModalVisible(false)}>
                Cuộc gọi đến
              </Text>
              <Text
                style={styles.modalOption}
                onPress={() => setModalVisible(false)}>
                Cuộc gọi đi
              </Text>
              <Text
                style={styles.modalOption}
                onPress={() => setModalVisible(false)}>
                Chặn cuộc gọi
              </Text>
              <Text
                style={styles.modalOption}
                onPress={() => setModalVisible(false)}>
                Cài đặt
              </Text>
            </View>
          </View>
        </Dialog>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Danh sách cuộc gọi</Text>
        <Avatar
          rounded
          size={32}
          icon={{name: 'plus', type: 'font-awesome'}}
          containerStyle={styles.addIcon}
          onPress={() => {
            Toast.show({
              type: 'success',
              text1: 'Thêm số mới',
              text2: 'Bạn có thể thêm số mới vào danh sách.',
            });
          }}
        />
      </View>
      {refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#18538C" />
        </View>
      ) : (
        <FlatList
          data={callLogs}
          keyExtractor={item => item.id}
          renderItem={renderCallLog}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
      <Dialog
        transparent={true}
        isVisible={callLogInfo}
        animationType="fade"
        onBackdropPress={() => setCallLogInfo(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalOption}>
              Số điện thoại: {selectedCallLog?.phoneNumber}
            </Text>
            <Text style={styles.modalOption}>
              Trạng thái: {selectedCallLog?.isSpam ? 'Spam' : 'Không Spam'}
            </Text>
            <TouchableOpacity
              onPress={() => setCallLogInfo(false)}
              style={styles.modalOption}>
              Đóng
            </TouchableOpacity>
          </View>
        </View>
      </Dialog>
    </Animated.View>
  );
};

export default CallLogHistory;

const createStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: 'white',
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      padding: 8,
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
    },
    searchIcon: {
      marginRight: 8,
      padding: 4,
      backgroundColor: '#18538C',
      borderRadius: 32,
    },
    searchPlaceholder: {
      flex: 1,
      fontSize: 16,
      color: 'gray',
    },
    menuIcon: {
      marginLeft: 8,
      backgroundColor: '#18538C',
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    addIcon: {
      backgroundColor: '#e0e0e0',
      padding: 4,
      borderRadius: 16,
    },
    callLogContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
    },
    callDetails: {
      flex: 1,
      marginLeft: 16,
    },
    phoneNumber: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    spamStatus: {
      fontSize: 14,
      color: 'gray',
    },
    time: {
      fontSize: 14,
      color: 'gray',
    },
    separator: {
      height: 1,
      backgroundColor: '#e0e0e0',
      marginVertical: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalOverlay: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
    },
    modalOption: {
      fontSize: 16,
      paddingVertical: 8,
      color: 'black',
    },
  });
};
