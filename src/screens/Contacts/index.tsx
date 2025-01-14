import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';

import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

import Contacts from 'react-native-contacts';
import {Avatar} from '@rneui/base';
import Item from './Item';
import {Input} from '@rneui/themed';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {SheetManager} from 'react-native-actions-sheet';
import EmptyComponents from '../../components/Empty';
import Loading from '../../components/Loading';

import Text from '../../components/Text';

const ContactsList = () => {
  const styles = createStyles();

  const [permissionStatus, setPermissionStatus] = React.useState(null);
  const [listContacts, setListContacts] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    checkContactsPermission();
    console.log('permissionStatus', permissionStatus);
    if (permissionStatus === RESULTS.GRANTED) getContact();
  }, []);
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

  console.log('listContacts', listContacts);

  const renderItemSeparator = () => {
    return (
      <View
        style={{
          borderWidth: 0.25,
          marginHorizontal: 8,
          borderColor: 'gray',
        }}
      />
    );
  };

  const renderItem = (item: any) => {
    return <Item item={item} />;
  };

  const renderEmpty = () => {
    return <EmptyComponents onPress={getContact} />;
  };

  const renderEndReached = () => {
    return (
      <View>
        <Text>Đã hết danh bạ của bạn </Text>
      </View>
    );
  };

  if (loading)
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          gap: 8,
        }}>
        <ActivityIndicator size={50} />
        <Text style={{textAlign: 'center'}}>
          Đang tải dữ liệu, vui lòng đợi
        </Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        placeholder="Nhập số điện thoại để tìm kiếm"
        rightIcon={
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <MaterialIcons
              name="person-search"
              color={'black'}
              size={30}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
            />
          </View>
        }
      />
      <Text style={{fontWeight: '500', paddingHorizontal: 8, fontSize: 20}}>
        Danh bạ của bạn
      </Text>
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={listContacts}
          renderItem={renderItem}
          ItemSeparatorComponent={renderItemSeparator}
          onEndReached={renderEndReached}
          ListEmptyComponent={renderEmpty}
        />
      )}
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
    listItem: {
      flexDirection: 'row',
      padding: 8,
      alignItems: 'center',
    },
    input: {marginTop: 8},
  });
};
