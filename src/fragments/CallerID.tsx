// CallerIDPopup.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {CallerDataManager, CallerInfo} from '../hooks/MMKV';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

interface CallerIDPopupProps {
  phoneNumber: string | null;
  callState: string | null;
  onDismiss: () => void;
}

const CallerIDPopup: React.FC<CallerIDPopupProps> = ({
  phoneNumber,
  callState,
  onDismiss,
}) => {
  const [callerInfo, setCallerInfo] = useState<CallerInfo | null>(null);
  const [animation] = useState(new Animated.Value(-200));

  useEffect(() => {
    // Only show for incoming calls
    if (callState === 'Incoming' && phoneNumber) {
      // Get caller information from storage
      const info = CallerDataManager.getCallerInfo(phoneNumber) || {
        name: 'Unknown Caller',
        isSpam: false,
        category: 'unknown' as const,
      };

      setCallerInfo(info);

      // Animate in
      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }).start();
    } else if (callState === 'Disconnected') {
      // Animate out
      Animated.timing(animation, {
        toValue: -200,
        useNativeDriver: true,
        duration: 300,
      }).start(onDismiss);
    }
  }, [callState, phoneNumber]);

  const handleMarkAsSpam = () => {
    if (phoneNumber && callerInfo) {
      CallerDataManager.markAsSpam(phoneNumber, true);
      setCallerInfo({...callerInfo, isSpam: true, category: 'spam'});
    }
  };

  const handleMarkAsNotSpam = () => {
    if (phoneNumber && callerInfo) {
      CallerDataManager.markAsSpam(phoneNumber, false);
      setCallerInfo({...callerInfo, isSpam: false, category: 'general'});
    }
  };

  if (!callerInfo || callState !== 'Incoming') {
    return null;
  }

  const {name, isSpam, category} = callerInfo;

  return (
    <Animated.View
      style={[
        styles.container,
        {transform: [{translateY: animation}]},
        isSpam && styles.spamContainer,
      ]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isSpam ? '⚠️ Potential Spam' : 'Incoming Call'}
        </Text>
        {isSpam && (
          <View style={styles.spamBadge}>
            <Text style={styles.spamText}>SPAM</Text>
          </View>
        )}
      </View>

      <View style={styles.callerInfo}>
        <Icon
          name={isSpam ? 'report-problem' : 'person'}
          size={30}
          color={isSpam ? '#FF3B30' : '#007AFF'}
        />
        <View style={styles.textContainer}>
          <Text style={styles.callerName}>{name}</Text>
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
          <Text style={styles.category}>
            Category: {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        {isSpam ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleMarkAsNotSpam}>
            <Text style={styles.actionText}>Not Spam</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.spamButton]}
            onPress={handleMarkAsSpam}>
            <Text style={styles.spamButtonText}>Mark as Spam</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  spamContainer: {
    backgroundColor: '#FFF8F8',
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  spamBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  spamText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  callerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  callerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  phoneNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  category: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  actionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  spamButton: {
    backgroundColor: '#FFE5E5',
  },
  spamButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
});

export default CallerIDPopup;
