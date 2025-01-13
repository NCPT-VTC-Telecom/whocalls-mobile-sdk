import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {
  Button,
  Modal,
  Portal,
  Provider as PaperProvider,
} from 'react-native-paper';

const OptionsList = () => {
  return (
    <PaperProvider>
      <Portal>
        <Modal
          visible={true}
          onDismiss={() => {}}
          contentContainerStyle={{backgroundColor: 'white', padding: 20}}>
          <Text>Example Modal. Click outside this area to dismiss.</Text>
        </Modal>
      </Portal>
      <Button style={{marginTop: 30}} onPress={() => {}}>
        Show
      </Button>
    </PaperProvider>
  );
};

export default OptionsList;

const styles = StyleSheet.create({});
