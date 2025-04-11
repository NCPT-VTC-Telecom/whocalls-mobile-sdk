import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import RNCallKeep from 'react-native-callkeep';

const CallerID = ({caller}) => {
  const handleAnswerCall = () => {
    RNCallKeep.answerIncomingCall(caller.uuid);
  };

  const handleDeclineCall = () => {
    RNCallKeep.endCall(caller.uuid);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.callerInfo}>
        <Text style={styles.appName}>truecaller</Text>
        <Text style={styles.incomingCall}>Incoming call</Text>
        <Text style={styles.phoneNumber}>{caller.phoneNumber}</Text>
        <Text style={styles.carrier}>{caller.carrier}</Text>
        <Image source={{uri: caller.photo}} style={styles.avatar} />
        <Text style={styles.callerName}>{caller.name}</Text>
        <Text style={styles.callerDetails}>{caller.details}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.declineButton} onPress={handleDeclineCall}>
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.answerButton} onPress={handleAnswerCall}>
          <Text style={styles.buttonText}>Answer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#007aff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callerInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  incomingCall: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  phoneNumber: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  carrier: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  callerName: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  callerDetails: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  declineButton: {
    backgroundColor: '#ff3b30',
    padding: 15,
    borderRadius: 50,
    width: 100,
    alignItems: 'center',
  },
  answerButton: {
    backgroundColor: '#4cd964',
    padding: 15,
    borderRadius: 50,
    width: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CallerID;
