import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const FeedbackScreen = () => {
  const [rating, setRating] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [feedback, setFeedback] = useState('');

  const categories = ['Hỗ trợ', 'Tính năng sản phẩm', 'Khác'];

  const handleRatingPress = (value: number) => {
    setRating(value);
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSubmit = () => {
    // Handle feedback submission logic here
    console.log({rating, selectedCategory, feedback});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mức độ hài lòng</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map(value => (
          <TouchableOpacity
            key={value}
            onPress={() => handleRatingPress(value)}
            style={[
              styles.ratingIcon,
              rating >= value && styles.selectedRatingIcon,
            ]}>
            <Text style={styles.ratingText}>🛡️</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.ratingLabel}>Rất tốt</Text>

      <Text style={styles.subtitle}>Bạn muốn đánh giá nội dung nào?</Text>
      <View style={styles.categoryContainer}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            onPress={() => handleCategoryPress(category)}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton,
            ]}>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.textInput}
        placeholder="Ý kiến của bạn ......"
        value={feedback}
        onChangeText={setFeedback}
        maxLength={300}
        multiline
      />
      <Text style={styles.charCount}>{feedback.length}/300</Text>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ratingIcon: {
    marginHorizontal: 4,
  },
  selectedRatingIcon: {
    opacity: 1,
  },
  ratingText: {
    fontSize: 24,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  categoryText: {
    fontSize: 14,
    color: '#000',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  textInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  charCount: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FeedbackScreen;
