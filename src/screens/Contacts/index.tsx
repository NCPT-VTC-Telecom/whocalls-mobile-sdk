import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {BottomSheet, Button, Dialog, Tab, TabView} from '@rneui/themed';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Contacts from 'react-native-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Text from '../../components/Text';
import EmptyComponents from '../../components/Empty';
import Item from './Item';
import CategorizeNumber from './CategorizeNumber';
import {useFocusEffect} from '@react-navigation/native';

const ContactsList = () => {
  const styles = createStyles();

  const [permissionStatus, setPermissionStatus] = React.useState(null);
  const [listContacts, setListContacts] = React.useState<any>({});
  const [localContacts, setLocalContacts] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState(0);

  const [isAddNumber, setIsAddNumber] = React.useState<boolean>(false);
  const [newNumber, setNewNumber] = React.useState<string>('');

  useFocusEffect(
    React.useCallback(() => {
      loadContactsFromStorage();
    }, [isAddNumber]),
  );

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      checkContactsPermission();
      if (permissionStatus === RESULTS.GRANTED) return;
    }
  }, [permissionStatus]);

  const checkContactsPermission = async () => {
    try {
      const status: any = await check(PERMISSIONS.ANDROID.READ_CONTACTS);
      setPermissionStatus(status);

      if (status === RESULTS.DENIED || status === RESULTS.BLOCKED) {
        requestContactsPermission();
      }
    } catch (error) {
      console.error('Permission check error:', error);
    }
  };

  const requestContactsPermission = async () => {
    try {
      const result: any = await request(PERMISSIONS.ANDROID.READ_CONTACTS);
      setPermissionStatus(result);
      if (result === RESULTS.GRANTED) {
        Alert.alert(
          'Quyền truy cập được chấp thuận',
          'Bạn có thể truy cập danh bạ.',
        );
      } else if (result === RESULTS.DENIED) {
        Alert.alert(
          'Quyền truy cập bị từ chối',
          'Không thể truy cập danh bạ mà không có quyền.',
        );
      } else if (result === RESULTS.BLOCKED) {
        Alert.alert(
          'Quyền truy cập bị chặn',
          'Vui lòng cấp quyền trong cài đặt ứng dụng.',
        );
      } else {
        return;
      }
    } catch (error) {
      console.error('Permission request error:', error);
    }
  };

  const loadContactsFromStorage = async () => {
    try {
      const storedContacts = await AsyncStorage.getItem('categorizedNumbers');
      setLocalContacts(storedContacts ? JSON.parse(storedContacts) : []);
    } catch (error) {
      console.error('Error loading contacts from storage:', error);
    }
  };

  const filterContacts = (category: string) => {
    if (!localContacts) return [];
    if (category === 'not-spam') {
      return localContacts?.contactList?.filter?.(
        i => i?.category === 'not-spam',
      );
    } else if (category === 'spam') {
      return localContacts?.contactList?.filter?.(i => i?.category === 'spam');
    }
    return localContacts;
  };

  const renderItem = (item: any) => {
    return <Item item={item} />;
  };

  const renderEmpty = () => {
    return <EmptyComponents onPress={() => {}} />;
  };

  const onPressAddNumber = () => {
    setIsAddNumber(true);
  };

  const closeSheet = () => {
    setIsAddNumber(false);
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={50} />
        <Text style={{textAlign: 'center'}}>
          Đang tải dữ liệu, vui lòng đợi
        </Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Tab
        value={selectedTab}
        onChange={e => setSelectedTab(e)}
        indicatorStyle={styles.tabIndicator}>
        <Tab.Item title="Tin tưởng" titleStyle={styles.tabTitle} />
        <Tab.Item title="Spam" titleStyle={styles.tabTitle} />
      </Tab>
      <TabView
        value={selectedTab}
        onChange={setSelectedTab}
        animationType="spring">
        <TabView.Item style={styles.tabView}>
          <FlatList
            data={filterContacts('not-spam')}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
          />
        </TabView.Item>
        <TabView.Item style={styles.tabView}>
          <FlatList
            data={filterContacts('spam')}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
          />
        </TabView.Item>
      </TabView>
      <Button
        title="Thêm số"
        onPress={onPressAddNumber}
        containerStyle={{margin: 16}}
      />
      <CategorizeNumber isVisible={isAddNumber} onClose={closeSheet} />
    </View>
  );
};

export default ContactsList;

const createStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    input: {
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
      padding: 16,
      flex: 1,
    },
    tabIndicator: {
      backgroundColor: '#18538C',
      height: 3,
    },
    tabTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#18538C',
    },
    tabView: {
      flex: 1,
      backgroundColor: 'white',
    },
    loadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      gap: 8,
    },
    headerContainer: {
      flexDirection: 'row',
      backgroundColor: '#f9f9f9',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '500',
      color: '#18538C',
      marginBottom: 8,
    },
  });
};
