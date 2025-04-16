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
import {Avatar, Button, Dialog} from '@rneui/themed';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getCallInformation} from '../../hooks/AddNumberSpam';
import EmptyComponents from '../../components/Empty';
import PlaceHolder from '../../components/PlaceHolder';
import {SheetManager} from 'react-native-actions-sheet';

interface CallLog {
  id: string;
  phoneNumber: string;
  isSpam: boolean;
  time: string;
  avatarUrl?: string;
}

const CallLogHistory = () => {
  const styles = createStyles();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedCallLog, setSelectedCallLog] = useState<CallLog | null>(null);
  const [callLogInfo, setCallLogInfo] = useState<boolean>(false);

  const [callLogs, setCallLogs] = useState<CallLog[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        handleGetCalllog();
        setLoading(false);
      });
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

  const handleGetCalllog = async () => {
    try {
      setLoading(true);

      const callLogs = await getCallInformation();
      setCallLogs(callLogs);
    } catch (error) {
      console.error('Error fetching call logs:', error);
      setLoading(false);
    }
  };

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
          onPress={() => {}}
        />
      </View>
      {refreshing ? (
        <View style={styles.loadingContainer}>
          <PlaceHolder />
        </View>
      ) : (
        <FlatList
          data={callLogs}
          keyExtractor={item => item.id}
          renderItem={renderCallLog}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshing={refreshing}
          ListEmptyComponent={() => <EmptyComponents onPress={() => {}} />}
          onRefresh={onRefresh}
        />
      )}
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
      gap: 16,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      flexDirection: 'row',
      backgroundColor: 'white',
      borderRadius: 8,
      alignItems: 'center',
    },
    modalOption: {
      fontSize: 16,
      color: 'black',
    },
    tickBackground: {
      position: 'absolute',
      left: 40,
      bottom: 0,
      backgroundColor: 'white',
      borderRadius: 24,
      shadowOffset: {height: 50, width: -50},
      shadowColor: 'black',
      shadowOpacity: 40,
    },
  });
};
