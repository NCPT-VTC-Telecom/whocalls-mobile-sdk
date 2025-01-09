import {View, Text, Image, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import React from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {images} from './assets';
import {BottomSheet} from '@rneui/themed';
import {SafeAreaView} from 'react-native-safe-area-context';

const Welcome: React.FC<StackScreenProps<any>> = ({navigation}) => {
  const styles = createStyles();

  const [open, setOpen] = React.useState<boolean>(false);
  const onPressBottomSheet = () => {
    setOpen(true);
  };

  const renderBottomSheet = () => {
    return (
      <BottomSheet isVisible={open}>
        <SafeAreaView>
          <ScrollView style={{height: 500, backgroundColor: 'white', padding: 16}}>
            <Text style={{fontSize: 20, fontWeight: '500'}}>Điều khoản và điều lệ</Text>
            <Text style={{flex: 1}}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an
              unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic
              typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently
              with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Contrary to popular belief, Lorem Ipsum is not simply random text. It has
              roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia,
              looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered
              the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in
              45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from
              a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de
              Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
              publishing software like Aldus PageMaker including versions of Lorem Ipsum. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece
              of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of
              the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable
              source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book
              is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in
              section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus
              Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
            </Text>
          </ScrollView>
        </SafeAreaView>
        <TouchableOpacity onPress={() => setOpen(false)} style={styles.read}>
          <Text style={{color: 'white', fontWeight: '500'}}>Tôi đã đọc</Text>
        </TouchableOpacity>
      </BottomSheet>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 32, gap: 8, marginVertical: 8}}>
      <Image source={images.logo} style={styles.images} />
      <Text style={[styles.text, {fontWeight: '500', fontSize: 20}]}>Chào mừng đến với WhoCalls</Text>
      <Text style={styles.text}>Nhấn "Đăng ký dịch vụ" đồng nghĩa với việc đồng ý với điều khoản của VTC Telecom</Text>
      <TouchableOpacity onPress={onPressBottomSheet}>
        <Text style={styles.terms}>Điều khoản và điều lệ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text>Đăng ký dịch vụ</Text>
      </TouchableOpacity>
      {renderBottomSheet()}
    </SafeAreaView>
  );
};

const createStyles = () => {
  return StyleSheet.create({
    images: {
      width: 150,
      height: 150,
    },
    text: {fontSize: 15, textAlign: 'center', color: 'black', alignItems: 'center'},
    button: {
      backgroundColor: 'lightblue',
      padding: 8,
      marginVertical: 8,
      borderRadius: 8,
      width: 200,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
    },
    terms: {
      marginVertical: 16,
      color: 'darkgreen',
    },
    read: {
      padding: 8,
      paddingHorizontal: 16,
      //   marginVertical: 8,
      backgroundColor: '#00A88E',
    },
  });
};

export default Welcome;
