import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_PROFILE_KEY = '@user_profile';
const IS_ONBOARDED_KEY = '@is_onboarded';

export const saveUserProfile = async (profile) => {
  try {
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
  }
};

export const getUserProfile = async () => {
  try {
    const profile = await AsyncStorage.getItem(USER_PROFILE_KEY);
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    return null;
  }
};

export const setIsOnboarded = async (value) => {
  try {
    await AsyncStorage.setItem(IS_ONBOARDED_KEY, JSON.stringify(value));
  } catch (error) {
  }
};

export const getIsOnboarded = async () => {
  try {
    const value = await AsyncStorage.getItem(IS_ONBOARDED_KEY);
    return value ? JSON.parse(value) : false;
  } catch (error) {
    return false;
  }
};

export const clearUserProfile = async () => {
  try {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
    await AsyncStorage.setItem(IS_ONBOARDED_KEY, JSON.stringify(false));
  } catch (error) {
  }
};