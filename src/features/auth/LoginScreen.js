import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../config/theme';
import { commonStyles } from '../../shared/styles/commonStyles';
import { loginUser } from '../../services/dbServices';
import { setUser } from '../../store/slices/authSlice';

const LoginScreen = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Please enter your credentials');
      return;
    }

    try {
      const user = await loginUser(identifier, password);
      if (user) {
        if (rememberMe) {
          await AsyncStorage.setItem('userToken', JSON.stringify(user));
        } else {
          await AsyncStorage.removeItem('userToken');
        }
        dispatch(setUser(user));
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong during login');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={commonStyles.safeArea}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to see what's happening</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.fixInput}
            placeholder="Username or Phone"
            placeholderTextColor="#999"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.fixInput, styles.mt]}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.rememberMeContainer}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <Icon
              name={rememberMe ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={24}
              color={rememberMe ? theme.colors.primary : theme.colors.subtext}
            />
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[commonStyles.primaryButton, styles.btn]}
          onPress={handleLogin}
        >
          <Text style={commonStyles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          style={styles.footerLink}
        >
          <Text style={commonStyles.subText}>
            Don't have an account? <Text style={styles.linkText}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: theme.spacing.l,
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerSection: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text },
  subtitle: { fontSize: 16, color: theme.colors.subtext, marginTop: 5 },
  inputContainer: { width: '100%' },
  fixInput: {
    ...commonStyles.inputField,
    textAlignVertical: 'center',
    paddingVertical: Platform.OS === 'ios' ? 15 : 10,
    includeFontPadding: false,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  rememberMeText: {
    marginLeft: 8,
    color: theme.colors.text,
    fontSize: 14,
  },
  mt: { marginTop: 15 },
  btn: { width: '100%', marginTop: 30 },
  footerLink: { marginTop: 20, alignItems: 'center' },
  linkText: { color: theme.colors.primary, fontWeight: 'bold' },
});

export default LoginScreen;
