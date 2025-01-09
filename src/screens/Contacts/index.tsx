import {Alert, StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

import Contacts from 'react-native-contacts';

const ContactsList = () => {
  const [permissionStatus, setPermissionStatus] = React.useState(null);

  React.useEffect(() => {
    checkContactsPermission();
  }, []);
  const checkContactsPermission = async () => {
    try {
      const status = await check(PERMISSIONS.ANDROID.READ_CONTACTS);
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
      const result = await request(PERMISSIONS.ANDROID.READ_CONTACTS);
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
  Contacts.getAll()
    .then(contacts => {
      console.log(contacts);
    })
    .catch(error => {
      console.error(error);
    });

  return (
    <View>
      <Text>Danh sách lịch sử cuộc gọi</Text>
    </View>
  );
};

export default ContactsList;

const styles = StyleSheet.create({});
