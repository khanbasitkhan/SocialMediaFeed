import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Dropdown } from 'react-native-element-dropdown';
import { theme } from '../../config/theme';
import { commonStyles } from '../../shared/styles/commonStyles';
import { registerUser } from '../../services/dbServices';

const DEFAULT_PROFILE_PIC =
  'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const genderData = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, response => {
      if (response.didCancel) return;
      if (response.assets && response.assets.length > 0) {
        setProfilePic(response.assets[0].uri);
      }
    });
  };

  const handleSignup = async () => {
    if (!username || !gender || !phone || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const finalProfilePic = profilePic || DEFAULT_PROFILE_PIC;
      await registerUser(username, gender, phone, password, finalProfilePic);
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'Login Now', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Username or Phone already exists');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={commonStyles.safeArea}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join our community today</Text>

        {/* Profile Image Section */}
        <View style={styles.imagePickerContainer}>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            <Image
              source={{ uri: profilePic || DEFAULT_PROFILE_PIC }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.plusIconContainer}
            onPress={pickImage}
          >
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.fixInput}
            placeholder="Username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Dropdown
            style={[
              styles.dropdown,
              isFocus && { borderColor: theme.colors.primary },
            ]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={styles.dropdownContainer}
            itemTextStyle={styles.itemText}
            data={genderData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Select Gender' : '...'}
            value={gender}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setGender(item.value);
              setIsFocus(false);
            }}
          />

          <TextInput
            style={[styles.fixInput, styles.mt]}
            placeholder="Phone Number"
            placeholderTextColor="#999"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.fixInput, styles.mt]}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[commonStyles.primaryButton, styles.btn]}
          onPress={handleSignup}
        >
          <Text style={commonStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.footerLink}
        >
          <Text style={commonStyles.subText}>
            Already have an account? <Text style={styles.linkText}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: theme.spacing.l,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.subtext,
    marginBottom: 30,
  },
  imagePickerContainer: {
    marginBottom: 30,
    position: 'relative',
  },
  imagePicker: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  plusIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  plusText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -2, // Vertical alignment fix
  },
  inputContainer: {
    width: '100%',
  },
  fixInput: {
    ...commonStyles.inputField,
    textAlignVertical: 'center',
    paddingVertical: Platform.OS === 'ios' ? 15 : 10,
    includeFontPadding: false,
  },
  dropdown: {
    ...commonStyles.inputField,
    height: 55,
    marginTop: 15,
    paddingHorizontal: 15,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: theme.colors.text,
  },
  dropdownContainer: {
    borderRadius: 10,
    marginTop: 5,
  },
  itemText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  mt: {
    marginTop: 15,
  },
  btn: {
    width: '100%',
    marginTop: 30,
  },
  footerLink: {
    marginTop: 20,
  },
  linkText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
