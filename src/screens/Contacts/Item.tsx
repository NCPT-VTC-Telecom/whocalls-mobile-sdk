import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from '../../components/Text';
import {Avatar} from '@rneui/base';
import {ContactInfomation, ContactList} from '../../interface';
// import {SheetManager} from 'react-native-actions-sheet';
import ContactInfo from './ContactInfo';

const Item = ({item}: {item: ContactList}) => {
  const renderSheet = () => {
    <ContactInfo isVisible={true} />;
  };
  if (!item) {
    return <View />;
  }
  return (
    <TouchableOpacity
      onPress={renderSheet}
      key={item?.index}
      style={styles.listItem}>
      <Avatar
        source={{
          uri:
            item?.item?.thumbnailPath ||
            `https://ui-avatars.com/api/?bold=true?format=svg&name=${item?.item?.displayName}&color=random&background=random`,
        }}
        size={50}
        avatarStyle={{
          borderRadius: 32,
          shadowOffset: {height: 50, width: -50},
          shadowColor: 'black',
          shadowOpacity: 40,
        }}
      />
      <View>
        <Text style={{fontSize: 18, marginHorizontal: 8, fontWeight: '500'}}>
          {item?.item?.displayName}
        </Text>
        <Text style={{fontSize: 13, marginHorizontal: 8}}>
          {item?.item?.phoneNumbers.find((i: any) => i?.label === 'Mobile')
            ?.number || 'Chưa được cập nhật'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Item;

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
  },
});
