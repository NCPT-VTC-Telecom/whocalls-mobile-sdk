import {Modal, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BottomSheet} from '@rneui/themed';

const ContactInfo = ({isVisible}: {isVisible: boolean}) => {
  return (
    <BottomSheet isVisible={isVisible}>
      <ScrollView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
        }}>
        <Text>ContactInfo</Text>
      </ScrollView>
    </BottomSheet>
  );
};

export default ContactInfo;

const styles = StyleSheet.create({});
