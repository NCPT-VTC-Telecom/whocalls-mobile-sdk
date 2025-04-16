import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {BottomSheet, Input, Button, CheckBox} from '@rneui/themed';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface CategorizeNumberProps {
  isVisible: boolean;
  onClose: () => void;
}

const CategorizeNumber: React.FC<CategorizeNumberProps> = ({
  isVisible,
  onClose,
}) => {
  const styles = createStyles();

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [category, setCategory] = useState<string>('Spam');
  const handleAddNumber = async () => {
    try {
      /** Defining the body for the local log */
      const newEntry = {
        id: Math.random().toString(36).substr(2, 9), // Generate a random ID
        name: '', // Placeholder for name, can be updated later
        numbers: phoneNumber,
        isBlocked: category === 'Spam', // Block if category is 'Spam'
        category,
      };

      const existingData = await AsyncStorage.getItem('categorizedNumbers');
      const parsedData = existingData
        ? JSON.parse(existingData)
        : {contactList: []};

      parsedData.contactList.push(newEntry);

      await AsyncStorage.setItem(
        'categorizedNumbers',
        JSON.stringify(parsedData),
      );

      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Số đã được thêm vào danh sách.',
      });
      onClose(); // Close the modal after adding the number
    } catch (error) {
      console.error('Error adding number:', error);
    }
  };

  return (
    <BottomSheet isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={{fontSize: 20, fontWeight: 'bold', marginVertical: 16}}>
            Thêm số mới
          </Text>
          <Input
            style={styles.textInput}
            placeholder="Nhập số điện thoại"
            underlineColorAndroid={'white'}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <View style={{flexDirection: 'row', marginBottom: 16, gap: 8}}>
            {/* <TouchableOpacity
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: 'green',
                alignItems: 'center',
              }}
              onPress={() => setCategory('not-spam')}>
              <Text style={{color: 'white'}}>Không Spam</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: 'red',
                padding: 12,
                alignItems: 'center',
              }}
              onPress={() => setCategory('Spam')}>
              {/* Add onPress for Spam button */}

            <CheckBox
              center
              title="Spam"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={'spam' === category}
              onPress={() => setCategory('spam')}
            />
            <CheckBox
              center
              title="Không phải spam"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={'not-spam' === category}
              onPress={() => setCategory('not-spam')}
            />
          </View>
          <Button title="Thêm" onPress={handleAddNumber} />
        </View>
      </View>
    </BottomSheet>
  );
};

export default CategorizeNumber;

const createStyles = () => {
  const {bottom} = useSafeAreaInsets();
  return StyleSheet.create({
    modalOverlay: {
      gap: 16,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      // flexDirection: 'row',
      backgroundColor: 'white',
      borderRadius: 8,
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: Math.max(bottom, 16),
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      width: '100%',
    },
  });
};
