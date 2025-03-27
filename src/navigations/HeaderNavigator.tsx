import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HeaderNavigatorProps {
  name: string;
}

const HeaderNavigator = ({name}: HeaderNavigatorProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState<'trusted' | 'spam'>('trusted');

  const addPhoneNumber = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    try {
      const existingData = await AsyncStorage.getItem('phoneNumbers');
      const phoneNumbers = existingData ? JSON.parse(existingData) : [];
      phoneNumbers.push({phoneNumber, status});
      await AsyncStorage.setItem('phoneNumbers', JSON.stringify(phoneNumbers));
      Alert.alert('Success', 'Phone number added successfully');
      setPhoneNumber('');
      setStatus('trusted');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save the phone number');
    }
  };

  return (
    <View
      style={{
        backgroundColor: '#18538C',
        padding: 8,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Text style={styles.title}>{name}</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.button}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>

      {/* Modal for adding phone number */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <View style={styles.radioGroup}>
              <TouchableOpacity
                onPress={() => setStatus('trusted')}
                style={styles.radioButton}>
                <Text
                  style={status === 'trusted' ? styles.radioSelected : null}>
                  Trusted
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setStatus('spam')}
                style={styles.radioButton}>
                <Text style={status === 'spam' ? styles.radioSelected : null}>
                  Spam
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={addPhoneNumber} style={styles.okButton}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HeaderNavigator;

const styles = StyleSheet.create({
  title: {fontWeight: '500', fontSize: 20, textAlign: 'center', color: 'white'},
  button: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  buttonText: {color: '#18538C', fontWeight: 'bold'},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  radioButton: {padding: 10},
  radioSelected: {fontWeight: 'bold', color: '#18538C'},
  okButton: {
    backgroundColor: '#18538C',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  okButtonText: {color: 'white', fontWeight: 'bold'},
});
