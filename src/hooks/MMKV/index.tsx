import {MMKV} from 'react-native-mmkv';

// Create a storage instance
export const storage = new MMKV({
  id: 'caller-id-storage',
  encryptionKey: 'secure-storage-key',
});

// Define caller information interfaces
export interface CallerInfo {
  name: string;
  isSpam: boolean;
  category: 'general' | 'business' | 'spam' | 'unknown';
  lastUpdated?: string;
  notes?: string;
  [key: string]: any; // Allow additional properties
}

export interface CallerDataCollection {
  [phoneNumber: string]: CallerInfo;
}

// CallerDataManager with TypeScript
export const CallerDataManager = {
  // Store caller information
  saveCallerInfo(
    phoneNumber: string,
    callerInfo: Partial<CallerInfo>,
  ): boolean {
    try {
      if (!phoneNumber) {
        console.error('Phone number is required to save caller info.');
        return false;
      }

      if (!callerInfo) {
        console.error('Caller info is required to save caller info.');
        return false;
      }
      // Get existing records
      const existingData = this.getAllCallerData();

      // Get existing record or create default
      const existingRecord = existingData[phoneNumber] || {
        name: 'Unknown',
        isSpam: false,
        category: 'unknown' as const,
      };

      // Update with new info
      existingData[phoneNumber] = {
        ...existingRecord,
        ...callerInfo,
        lastUpdated: new Date().toISOString(),
      };

      // Save back to storage
      storage.set('callerData', JSON.stringify(existingData));
      return true;
    } catch (error) {
      console.error('Failed to save caller info:', error);
      return false;
    }
  },

  // Get information for a specific number
  getCallerInfo(phoneNumber: string): CallerInfo | null {
    try {
      const allData = this.getAllCallerData();
      return allData[phoneNumber] || null;
    } catch (error) {
      console.error('Failed to get caller info:', error);
      return null;
    }
  },

  // Mark a number as spam
  markAsSpam(phoneNumber: string, isSpam: boolean = true): boolean {
    const callerInfo = this.getCallerInfo(phoneNumber) || {
      name: 'Unknown',
      category: 'unknown',
      isSpam: false,
    };
    return this.saveCallerInfo(phoneNumber, {
      ...callerInfo,
      isSpam,
      category: isSpam
        ? 'spam'
        : callerInfo.category !== 'spam'
        ? callerInfo.category
        : 'general',
    });
  },

  // Check if a number is marked as spam
  isSpam(phoneNumber: string): boolean {
    const info = this.getCallerInfo(phoneNumber);
    return info ? !!info.isSpam : false;
  },

  // Get all caller data from storage
  getAllCallerData(): CallerDataCollection {
    try {
      const jsonData = storage.getString('callerData');
      return jsonData ? JSON.parse(jsonData) : {};
    } catch (error) {
      console.error('Failed to get all caller data:', error);
      return {};
    }
  },

  // Search for callers by name or category
  searchCallers(
    query?: string,
    category?: string | null,
  ): CallerDataCollection {
    const allData = this.getAllCallerData();
    const results: CallerDataCollection = {};

    Object.entries(allData).forEach(([phone, info]) => {
      // Filter by category if provided
      if (category && info.category !== category) {
        return;
      }

      // Search by name or number
      const matchesQuery =
        !query ||
        phone.includes(query) ||
        (info.name && info.name.toLowerCase().includes(query.toLowerCase()));

      if (matchesQuery) {
        results[phone] = info;
      }
    });

    return results;
  },

  // Import contacts from JSON
  importFromJSON(jsonData: string | object): number {
    try {
      const data =
        typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      let imported = 0;

      Object.entries(data as CallerDataCollection).forEach(([phone, info]) => {
        if (this.saveCallerInfo(phone, info)) {
          imported++;
        }
      });

      return imported;
    } catch (error) {
      console.error('Failed to import from JSON:', error);
      return 0;
    }
  },

  // Export all data to JSON
  exportToJSON(): string {
    return JSON.stringify(this.getAllCallerData());
  },
};
