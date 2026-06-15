import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ScrollView,
  BackHandler,
} from 'react-native';
import { CommonActions } from '@react-navigation/native'; // ✅ Agrega esta línea
import { saveUserProfile, setIsOnboarded } from '../utils/storage';

const OnboardingScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = () => {
    return firstName.trim() !== '' && 
           email.trim() !== '' &&
           isValidEmail(email);
  };

  const handleNext = async () => {
    
    if (isFormValid()) {
      const userProfile = {
        firstName: firstName.trim(),
        email: email.trim(),
        phone: '',
      };
      
      await saveUserProfile(userProfile);
      await setIsOnboarded(true);
      
      navigation.replace('Home');
    } else {
      Alert.alert('Error', 'Please enter valid name and email');
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
    return () => backHandler.remove();
  }, []);
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/HeaderLogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.heroSection}>
            <View style={styles.heroContent}>
              <Text style={styles.restaurantName}>Little Lemon</Text>
              <Text style={styles.location}>Chicago</Text>
              <Text style={styles.description}>
                We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
              </Text>
            </View>
            <View style={styles.heroImageContainer}>
              <Image 
                source={require('../assets/HeroImage.png')} 
                style={styles.heroImage} 
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !isFormValid() && styles.nextButtonDisabled]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 0, 
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 200,
    height: 80,
  },
  heroSection: {
    backgroundColor: '#495E57',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  heroContent: {
    flex: 2, 
    paddingRight: 12,
  },
  restaurantName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F4CE14',
    marginBottom: 4,
  },
  location: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#EDEFEE',
    lineHeight: 20,
  },
  heroImageContainer: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    backgroundColor: '#F4CE14',
  },
  form: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    paddingTop: 10,
  },
  nextButton: {
    backgroundColor: '#F4CE14',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  nextButtonText: {
    color: '#495E57',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;