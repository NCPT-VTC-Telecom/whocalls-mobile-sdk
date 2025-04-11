import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import DocumentPicker from '@react-native-documents/picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
  time: string;
  sender: boolean;
  attachment?: any;
}

const SMSPage = () => {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([
    {id: '1', text: 'Text ....................', time: '11:05', sender: true},
    {id: '2', text: 'Text ....................', time: '11:05', sender: false},
  ]);
  const [inputText, setInputText] = useState<string>('');

  const sendSMS = () => {
    if (inputText.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          text: inputText,
          time: '11:05',
          sender: false,
        },
      ]);
      setInputText('');
    }
  };

  const makeCall = () => {
    Linking.openURL('tel:0948641075');
  };

  const addAttachment = async () => {
    try {
      const res: any = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const attachmentName = res?.name || 'file';
      const attachmentExtension = res.type?.split('/').pop() || '';
      const displayText = `${attachmentName}${
        attachmentExtension ? `.${attachmentExtension}` : ''
      }`;

      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          text: displayText,
          time: '11:05',
          sender: false,
          attachment: res,
        },
      ]);
    } catch (err) {
      if ((err as any)?.code === 'DOCUMENT_PICKER_CANCELED') {
        console.log('User canceled file picker');
      } else {
        console.error('Error picking file:', err);
      }
    }
  };

  const handleLongPress = (messageId: string, currentText: string) => {
    Alert.alert(
      'Message Options',
      'What would you like to do?',
      [
        {
          text: 'Edit',
          onPress: () => editMessage(messageId, currentText),
        },
        {
          text: 'Delete',
          onPress: () => deleteMessage(messageId),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  const deleteMessage = (messageId: string) => {
    setMessages(
      messages.filter((message: {id: string}) => message.id !== messageId),
    );
  };

  const editMessage = (messageId: string, currentText: string) => {
    setInputText(currentText);
    setMessages(
      messages.filter((message: {id: string}) => message.id !== messageId),
    );
  };

  const scale = useSharedValue<number>(0);

  React.useEffect(() => {
    scale.value = withSpring(1, {damping: 5, stiffness: 150});
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const renderMessage = ({item}: {item: any}) => {
    return (
      <TouchableOpacity
        onLongPress={() => handleLongPress(item.id, item.text)}
        activeOpacity={0.7}>
        <Animated.View
          style={[
            styles.messageContainer,
            item.sender ? styles.senderMessage : styles.receiverMessage,
            animatedStyle,
          ]}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top, gap: 8}]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.phoneNumber}>0948641075</Text>
          <View style={styles.headerIcons}></View>

          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity>
          <MaterialIcons
            name="attachment"
            size={24}
            color="black"
            onPress={addAttachment}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Gửi tin nhắn"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity onPress={sendSMS}>
          <Ionicons name="send" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    gap: 12,
    borderBottomColor: '#ddd',
  },
  phoneNumber: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  messageList: {
    padding: 10,
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  senderMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  receiverMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1e7ff',
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#f5f5f5',
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    backgroundColor: '#fff',
  },
});

export default SMSPage;
