import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import {Tab, TabView} from '@rneui/themed';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Contacts from 'react-native-contacts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Input} from '@rneui/themed';
import Text from '../../components/Text';
import EmptyComponents from '../../components/Empty';
import Loading from '../../components/Loading';
import Item from './Item';

const ContactsList = () => {
  const styles = createStyles();

  const [permissionStatus, setPermissionStatus] = React.useState(null);
  const [listContacts, setListContacts] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState(0);

  React.useEffect(() => {
    checkContactsPermission();
    if (permissionStatus === RESULTS.GRANTED) getContact();
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

  const renderHeader = () => {
    const trustedContacts = filterContacts('trust');
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Trusted Numbers</Text>
        {trustedContacts.length > 0 ? (
          <FlatList
            data={trustedContacts}
            keyExtractor={(item: any) => item.recordID}
            renderItem={({item}) => (
              <Text style={styles.trustedContact}>{item.name}</Text>
            )}
          />
        ) : (
          <Text style={styles.noTrustedContacts}>
            No trusted contacts found
          </Text>
        )}
      </View>
    );
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
      {renderHeader()}
      <Input
        style={styles.input}
        placeholder="Nhập số điện thoại để tìm kiếm"
        rightIcon={
          <MaterialIcons name="person-search" color={'black'} size={30} />
        }
      />
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
      marginTop: 8,
    },
    tabIndicator: {
      backgroundColor: 'blue',
      height: 3,
    },
    tabTitle: {
      fontSize: 14,
      fontWeight: 'bold',
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
      padding: 16,
      backgroundColor: '#f9f9f9',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    trustedContact: {
      fontSize: 16,
      color: 'green',
    },
    noTrustedContacts: {
      fontSize: 14,
      color: 'gray',
    },
  });
};
