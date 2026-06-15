import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Switch,
} from 'react-native';
import {
  getUserProfile,
  saveUserProfile,
  clearUserProfile,
  setIsOnboarded,
} from '../utils/storage';
import { getIsOnboarded } from '../utils/storage';
import { CommonActions } from '@react-navigation/native';

const ProfileScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notifications, setNotifications] = useState({
    orderStatuses: true,
    passwordChanges: true,
    specialOffers: true,
    newsletter: true,
  });

  useEffect(() => {
    const checkAccess = async () => {
        const onboarded = await getIsOnboarded();
        if (!onboarded) {
        navigation.replace('Onboarding');
        }
    };
    checkAccess();
    }, []);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const profile = await getUserProfile();
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
    }
  };

  const handleSaveChanges = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const updatedProfile = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    await saveUserProfile(updatedProfile);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleDiscardChanges = async () => {
    await loadProfile();
    Alert.alert('Changes discarded', 'Your profile has been reset');
  };

  const handleLogout = async () => {
    
    Alert.alert(
      'Log out',
      'Are you sure you want to log out? All your data will be cleared.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: async () => {
            await clearUserProfile();            
            navigation.replace('Onboarding');
          },
        },
      ]
    );
  };

  const NotificationSwitch = ({ label, value, onValueChange }) => (
    <View style={styles.switchRow}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: '#F4CE14' }}
        thumbColor={value ? '#495E57' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Personal information</Text>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../assets/profile-icon.png')}
              style={styles.avatar}
            />
          </View>
          <View style={styles.avatarButtons}>
            <TouchableOpacity style={{...styles.avatarButton, backgroundColor: '#495E57'}}>
              <Text style={styles.avatarButtonText, {  color: '#ffffff' }}>Change</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarButton}>
              <Text style={styles.avatarButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
          />

          <Text style={styles.label}>Last name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter last name"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Enter email"
          />

          <Text style={styles.label}>Phone number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="Enter phone number"
          />
        </View>

        {/* Email Notifications */}
        <Text style={[styles.sectionTitle, styles.notificationsTitle]}>
          Email notifications
        </Text>
        
        <View style={styles.notificationsSection}>
          <NotificationSwitch
            label="Order statuses"
            value={notifications.orderStatuses}
            onValueChange={(value) => 
              setNotifications({ ...notifications, orderStatuses: value })
            }
          />
          <NotificationSwitch
            label="Password changes"
            value={notifications.passwordChanges}
            onValueChange={(value) => 
              setNotifications({ ...notifications, passwordChanges: value })
            }
          />
          <NotificationSwitch
            label="Special offers"
            value={notifications.specialOffers}
            onValueChange={(value) => 
              setNotifications({ ...notifications, specialOffers: value })
            }
          />
          <NotificationSwitch
            label="Newsletter"
            value={notifications.newsletter}
            onValueChange={(value) => 
              setNotifications({ ...notifications, newsletter: value })
            }
          />
        </View>

        {/* Log out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.discardButton} onPress={handleDiscardChanges}>
            <Text style={styles.discardButtonText}>Discard changes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#495E57',
  },
  avatarButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  avatarButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#EDEFEE',
    borderRadius: 6,
  },
  avatarButtonText: {
    color: '#495E57',
    fontSize: 14,
    fontWeight: '500',
  },
  form: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  notificationsTitle: {
    marginTop: 8,
    marginBottom: 16,
  },
  notificationsSection: {
    marginBottom: 24,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEFEE',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333333',
  },
  logoutButton: {
    backgroundColor: '#F4CE14',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  logoutButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  discardButton: {
    flex: 1,
    backgroundColor: '#EDEFEE',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#495E57',
  },
  discardButtonText: {
    color: '#495E57',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#495E57',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;