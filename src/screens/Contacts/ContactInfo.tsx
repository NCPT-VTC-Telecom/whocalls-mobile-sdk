import {Modal, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const ContactInfo = ({isVisible}: {isVisible: boolean}) => {
  return (
    <Modal transparent={true} animationType="slide" visible={isVisible}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
        }}>
        <Text>ContactInfo</Text>
      </View>
    </Modal>
  );
};

export default ContactInfo;

const styles = StyleSheet.create({});
