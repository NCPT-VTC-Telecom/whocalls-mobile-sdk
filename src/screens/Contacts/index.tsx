import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Dialog, Tab, TabView} from '@rneui/themed';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Contacts from 'react-native-contacts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Input} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Text from '../../components/Text';
import EmptyComponents from '../../components/Empty';
import Loading from '../../components/Loading';
import Item from './Item';
import {RadioButton} from 'react-native-paper';

const ContactsList = () => {
  const styles = createStyles();

  const [permissionStatus, setPermissionStatus] = React.useState(null);
  const [listContacts, setListContacts] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState(0);

  const [isAddNumber, setIsAddNumber] = React.useState<boolean>(false);
  const [newNumber, setNewNumber] = React.useState<string>('');

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      checkContactsPermission();
      if (permissionStatus === RESULTS.GRANTED) getContact();
      loadContactsFromStorage();
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
        Alert.alert('Permission Granted', 'You can now access contacts.');
      } else {
        Alert.alert(
          'Permission Denied',
          'Cannot access contacts without permission.',
        );
      }
    } catch (error) {
      console.error('Permission request error:', error);
    }
  };

  const getContact = async () => {
    try {
      setLoading(true);
      const contacts = await Contacts.getAll();
      setListContacts(contacts);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const loadContactsFromStorage = async () => {
    try {
      const storedContacts = await AsyncStorage.getItem('customContacts');
      if (storedContacts) {
        const parsedContacts = JSON.parse(storedContacts);
        setListContacts((prevContacts: any) => [
          ...prevContacts,
          ...parsedContacts,
        ]);
      }
    } catch (error) {
      console.error('Error loading contacts from storage:', error);
    }
  };

  const saveContactToStorage = async (contact: any) => {
    try {
      const storedContacts = await AsyncStorage.getItem('customContacts');
      const parsedContacts = storedContacts ? JSON.parse(storedContacts) : [];
      const updatedContacts = [...parsedContacts, contact];
      await AsyncStorage.setItem(
        'customContacts',
        JSON.stringify(updatedContacts),
      );
    } catch (error) {
      console.error('Error saving contact to storage:', error);
    }
  };

  const addNewContact = () => {
    if (!newNumber.trim()) {
      Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }

    const newContact = {
      name: `Custom Contact ${newNumber}`,
      phoneNumber: newNumber,
    };
    setListContacts((prevContacts: any) => [...prevContacts, newContact]);
    saveContactToStorage(newContact);
    setNewNumber('');
    setIsAddNumber(false);
  };

  const filterContacts = (type: string) => {
    if (type === 'trust') {
      return listContacts.filter((contact: any) =>
        contact.name?.toLowerCase().includes('trust'),
      );
    } else if (type === 'spam') {
      return listContacts.filter((contact: any) =>
        contact.name?.toLowerCase().includes('spam'),
      );
    }
    return listContacts;
  };

  const renderItem = (item: any) => {
    return <Item item={item} />;
  };

  const renderEmpty = () => {
    return <EmptyComponents onPress={getContact} />;
  };

  const onPressAddNumber = () => {
    setIsAddNumber(true);
  };

  const onChangeMarkSpam = (item: any) => {
    const updatedContacts = listContacts.map((contact: any) => {
      if (contact.phoneNumber === item.phoneNumber) {
        return {
          ...contact,
          isSpam: !contact.isSpam,
        };
      }
      return contact;
    });
    setListContacts(updatedContacts);
    saveContactToStorage(updatedContacts);
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
        <Tab.Item title="Tất cả" titleStyle={styles.tabTitle} />
        <Tab.Item title="Tin tưởng" titleStyle={styles.tabTitle} />
        <Tab.Item title="Spam" titleStyle={styles.tabTitle} />
      </Tab>
      <TabView
        value={selectedTab}
        onChange={setSelectedTab}
        animationType="spring">
        <TabView.Item style={styles.tabView}>
          <FlatList
            data={filterContacts('all')}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
          />
        </TabView.Item>
        <TabView.Item style={styles.tabView}>
          <FlatList
            data={filterContacts('trust')}
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
      <Dialog
        isVisible={isAddNumber}
        onBackdropPress={() => setIsAddNumber(false)}
        overlayStyle={{
          borderRadius: 16,
          padding: 16,
          width: '90%',
          height: 350,
        }}
        animationType="fade">
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text style={styles.headerTitle}>Thêm số điện thoại tin tưởng</Text>
          <Input
            placeholder="Nhập số điện thoại"
            leftIcon={{type: 'font-awesome', name: 'phone', color: '#18538C'}}
            containerStyle={{width: '100%', marginBottom: 16}}
            value={newNumber}
            onChangeText={setNewNumber}
          />
          <View>
            <RadioButton
              value="first"
              status={'checked'}
              // onPress={() => setChecked('first')}
            />
            <RadioButton value="Tin tưởng" color="#18538C" />
          </View>
          <Button title="OK" onPress={addNewContact} />
        </View>
      </Dialog>
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
