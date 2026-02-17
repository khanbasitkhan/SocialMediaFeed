import React, { useState, useCallback } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { theme } from '../../config/theme';
import { getUserAnalytics, updateUserProfile } from '../../services/dbServices';
import { commonStyles } from '../../shared/styles/commonStyles';
import { logout, setUser } from '../../store/slices/authSlice';

const ProfileScreen = ({ navigation }) => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();


  const [isEditing, setIsEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState(user?.username || '');
  const [updatedPhone, setUpdatedPhone] = useState(user?.phone || '');
  const [updatedPic, setUpdatedPic] = useState(user?.profilePic || null);

  const [analytics, setAnalytics] = useState({
    totalLikes: 0,
    totalComments: 0,
  });

  const loadAnalytics = useCallback(async () => {
    try {
      if (user?.id) {
        const data = await getUserAnalytics(user.id);
        setAnalytics({
          totalLikes: data.totalLikes || 0,
          totalComments: data.totalComments || 0,
        });
      }
    } catch (error) {
      console.log('Analytics Error:', error);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadAnalytics();
    }, [loadAnalytics]),
  );

  const handleLogout = () => {
    dispatch(logout());
    // navigation.replace('Auth', { screen: 'Login' });
  };

  const pickImage = () => {
    if (!isEditing) return;
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, response => {
      if (response.assets && response.assets.length > 0) {
        setUpdatedPic(response.assets[0].uri);
      }
    });
  };

  const handleUpdate = async () => {
    try {
      if (!updatedName || !updatedPhone) {
        Alert.alert('Error', 'Fields cannot be empty');
        return;
      }
      await updateUserProfile(user.id, updatedName, updatedPhone, updatedPic);

      
      const updatedUserData = {
        ...user,
        username: updatedName,
        phone: updatedPhone,
        profilePic: updatedPic,
      };
      dispatch(setUser(updatedUserData));

      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.log(error);
    }
  };

  return (
    <ScrollView style={commonStyles.safeArea}>
      <View style={styles.header}>
       
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="logout" size={20} color="red" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => (isEditing ? handleUpdate() : setIsEditing(true))}
        >
          <Icon
            name={isEditing ? 'check' : 'edit'}
            size={20}
            color={theme.colors.primary}
          />
        </TouchableOpacity>

        <View style={styles.profileInfo}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
            <Image
              source={
                updatedPic
                  ? { uri: updatedPic }
                  : require('../../assets/images/Social Media Feed App.png')
              }
              style={[styles.avatar, isEditing && styles.editingAvatar]}
            />
            {isEditing && (
              <View style={styles.cameraIconBadge}>
                <Icon name="camera" size={14} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {isEditing ? (
            <View style={styles.editForm}>
              <TextInput
                style={styles.input}
                value={updatedName}
                onChangeText={setUpdatedName}
                placeholder="Username"
              />
              <TextInput
                style={styles.input}
                value={updatedPhone}
                onChangeText={setUpdatedPhone}
                placeholder="Phone"
                keyboardType="phone-pad"
              />
            </View>
          ) : (
            <>
              <Text style={styles.userName}>
                {user?.username || 'User Name'}
              </Text>
              <Text style={commonStyles.subText}>
                {user?.phone || 'No Phone'}
              </Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.analyticsSection}>
        <Text style={styles.sectionTitle}>Post Analytics</Text>
        <View style={styles.statsContainer}>
          <View
            style={[styles.statCard, { borderLeftColor: theme.colors.primary }]}
          >
            <Icon name="heart" size={24} color={theme.colors.primary} />
            <Text style={styles.statNumber}>{analytics.totalLikes}</Text>
            <Text style={styles.statLabel}>Total Likes</Text>
          </View>

          <View
            style={[
              styles.statCard,
              { borderLeftColor: theme.colors.secondary },
            ]}
          >
            <Icon name="message1" size={24} color={theme.colors.secondary} />
            <Text style={styles.statNumber}>{analytics.totalComments}</Text>
            <Text style={styles.statLabel}>Total Comments</Text>
          </View>
        </View>
      </View>

      {isEditing && (
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => {
            setIsEditing(false);
            setUpdatedName(user.username);
            setUpdatedPhone(user.phone);
            setUpdatedPic(user.profilePic);
          }}
        >
          <Text style={{ color: 'gray' }}>Cancel Editing</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 30,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  logoutBtn: { position: 'absolute', right: 20, top: 20 },
  editBtn: { position: 'absolute', left: 20, top: 20 },
  profileInfo: { alignItems: 'center', width: '100%' },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: theme.colors.primary,
    marginBottom: 15,
  },
  editingAvatar: {
    opacity: 0.6,
    borderColor: theme.colors.secondary,
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 20,
    right: 5,
    backgroundColor: theme.colors.primary,
    padding: 6,
    borderRadius: 12,
  },
  userName: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
  editForm: { width: '80%', marginTop: 10 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 16,
    color: theme.colors.text,
    padding: 5,
  },
  analyticsSection: { padding: 20, marginTop: 10 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: theme.colors.text,
  },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: {
    width: '47%',
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
    borderLeftWidth: 5,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 5,
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.subtext,
    textTransform: 'uppercase',
  },
  cancelBtn: { alignSelf: 'center', marginTop: 20, padding: 10 },
});

export default ProfileScreen;
