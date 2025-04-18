import React from 'react';

import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ListRenderItemInfo,
} from 'react-native';

import {name as appName} from './app.json';
import {AppRegistry} from 'react-native';

import Toast from 'react-native-toast-message';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Welcome from './src/Welcome';
import TabNavigator from './src/navigations/TabNavigator';
import OptionsList from './src/screens/Settings/Options';
import Feedback from './src/screens/Feedbacks'; // Import the Feedback screen
import {SheetProvider} from 'react-native-actions-sheet';

import {CallerDataManager, CallerDataCollection} from './src/hooks/MMKV';

import CallDetectorManager from './src/apis/CallDetection';

import {CallerInfo} from './src/hooks/MMKV';

interface ActiveCallState {
  state: string | null;
  phoneNumber: string | null;
}

interface ContactItemProps {
  phoneNumber: string;
  info: CallerInfo;
}

interface CategoryButtonProps {
  title: string;
  category: string | null;
  selectedCategory: string | null;
  onPress: (category: string | null) => void;
}

function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator();

  const screen = [
    {
      name: 'Home',
      component: TabNavigator,
      options: {title: 'Home', headerShown: false},
    },
    {
      name: 'OptionsList' as string,
      component: OptionsList,
      options: {title: 'OptionsList', headerShown: false},
    },
    {
      name: 'Welcome',
      component: Welcome,
      options: {title: 'Details Screen', headerShown: false},
    },
    {
      name: 'Feedback', // Add the Feedback screen route
      component: Feedback,
      options: {title: 'Feedback', headerShown: true}, // Enable header for Feedback
    },
  ];

  const [activeCall, setActiveCall] = React.useState<ActiveCallState>({
    state: null,
    phoneNumber: null,
  });
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [displayedContacts, setDisplayedContacts] = React.useState<
    Record<string, CallerInfo>
  >({});
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null,
  );
  const callDetector = React.useRef<CallDetectorManager | null>(null);

  // Initialize call detection
  React.useEffect(() => {
    // Import sample data on first run
    const sampleData = {
      '+1234567890': {name: 'John Doe', category: 'general', isSpam: false},
      '+1987654321': {name: 'Spam Caller', category: 'spam', isSpam: true},
      '+1122334455': {name: 'Pizza Shop', category: 'business', isSpam: false},
    };
    CallerDataManager?.importFromJSON(sampleData);

    // Set up call detection
    callDetector.current = new CallDetectorManager((callState, number) => {
      setActiveCall({
        state: callState,
        phoneNumber: number || null,
      });
    });

    callDetector.current.startListener();

    // Initial contact loading
    updateDisplayedContacts();

    return () => {
      if (callDetector.current) {
        callDetector.current.stopListener();
      }
    };
  }, []);

  // Update displayed contacts when search or category changes
  React.useEffect(() => {
    updateDisplayedContacts();
  }, [searchQuery, selectedCategory]);

  const updateDisplayedContacts = (): void => {
    const contacts = CallerDataManager.searchCallers(
      searchQuery,
      selectedCategory,
    );
    setDisplayedContacts(contacts);
  };

  const handleDismissPopup = (): void => {
    setActiveCall({state: null, phoneNumber: null});
  };

  const handleMarkContact = (phoneNumber: string, isSpam: boolean): void => {
    CallerDataManager.markAsSpam(phoneNumber, isSpam);
    updateDisplayedContacts();
  };

  const renderContactItem = ({
    item,
  }: ListRenderItemInfo<[string, CallerInfo]>): React.ReactElement => {
    const [phoneNumber, info] = item;

    return (
      <View style={styles.contactItem}>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{info.name}</Text>
          <Text style={styles.contactNumber}>{phoneNumber}</Text>
          <Text
            style={[
              styles.contactCategory,
              info.isSpam && styles.spamCategory,
            ]}>
            {info.category || 'general'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.markButton}
          onPress={() => handleMarkContact(phoneNumber, !info.isSpam)}>
          <Text style={styles.markButtonText}>
            {info.isSpam ? 'Not Spam' : 'Mark Spam'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const CategoryButton: React.FC<CategoryButtonProps> = ({
    title,
    category,
    selectedCategory,
    onPress,
  }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.selectedCategoryButton,
      ]}
      onPress={() => onPress(selectedCategory === category ? null : category)}>
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategory === category && styles.selectedCategoryText,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SheetProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName="Home">
            {screen.map((screen, index) => (
              <Stack.Screen
                key={index}
                name={screen.name}
                component={screen.component}
                options={screen.options} // Use the options defined in the array
              />
            ))}
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </SafeAreaProvider>
    </SheetProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 16,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  categoryFilters: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  selectedCategoryButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#FFF',
  },
  contactList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  contactItem: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  contactNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  contactCategory: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  spamCategory: {
    color: '#FF3B30',
  },
  markButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  markButtonText: {
    color: '#FF3B30',
    fontWeight: '500',
    fontSize: 12,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
    fontSize: 16,
  },
});

export default App;
