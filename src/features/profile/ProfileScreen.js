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
    <View style={commonStyles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          
         
          <View style={styles.actionRow}>
            {isEditing ? (
              
              <>
                <TouchableOpacity 
                  style={[styles.iconCircle, {backgroundColor: '#feebea'}]} 
                  onPress={() => {
                    setIsEditing(false);
                    setUpdatedName(user.username);
                    setUpdatedPhone(user.phone);
                    setUpdatedPic(user.profilePic);
                  }}
                >
                  <Icon name="close" size={20} color="#d32f2f" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.iconCircle, {backgroundColor: '#e8f5e9'}]} 
                  onPress={handleUpdate}
                >
                  <Icon name="check" size={20} color="#2e7d32" />
                </TouchableOpacity>
              </>
            ) : (
              
              <>
                <TouchableOpacity style={styles.iconCircle} onPress={() => setIsEditing(true)}>
                  <Icon name="edit" size={18} color={theme.colors.primary} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.iconCircle} onPress={handleLogout}>
                  <Icon name="logout" size={18} color="red" />
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.profileInfo}>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={styles.avatarWrapper}>
              <Image
                source={updatedPic ? { uri: updatedPic } : require('../../assets/images/Social Media Feed App.png')}
                style={[styles.avatar, isEditing && styles.editingAvatar]}
              />
              {isEditing && (
                <View style={styles.cameraBadge}>
                  <Icon name="camera" size={16} color="#fff" />
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
                  placeholderTextColor="#999"
                  autoFocus
                />
                <TextInput
                  style={styles.input}
                  value={updatedPhone}
                  onChangeText={setUpdatedPhone}
                  placeholder="Phone"
                  keyboardType="phone-pad"
                  placeholderTextColor="#999"
                />
              </View>
            ) : (
              <View style={{alignItems: 'center'}}>
                <Text style={styles.userName}>{user?.username || 'User Name'}</Text>
                <View style={styles.phoneBadge}>
                  <Icon name="phone" size={12} color={theme.colors.subtext} />
                  <Text style={styles.phoneText}>{user?.phone || 'No Phone'}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        
        <View style={styles.contentBody}>
          <Text style={styles.sectionTitle}>Post Analytics</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
               <View style={[styles.iconBox, {backgroundColor: '#ffebee'}]}>
                  <Icon name="heart" size={22} color="#f44336" />
               </View>
               <Text style={styles.statNumber}>{analytics.totalLikes}</Text>
               <Text style={styles.statLabel}>Likes</Text>
            </View>

            <View style={styles.statCard}>
               <View style={[styles.iconBox, {backgroundColor: '#e3f2fd'}]}>
                  <Icon name="message1" size={22} color="#2196f3" />
               </View>
               <Text style={styles.statNumber}>{analytics.totalComments}</Text>
               <Text style={styles.statLabel}>Comments</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    position: 'absolute',
    top: 20,
    width: '100%',
    zIndex: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatarWrapper: {
    position: 'relative',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 5,
    borderColor: '#fff',
  },
  editingAvatar: {
    borderColor: theme.colors.primary,
    opacity: 0.8,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: theme.colors.primary,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 15,
    letterSpacing: 0.5,
  },
  phoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    marginTop: 5,
  },
  phoneText: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginLeft: 5,
  },
  editForm: {
    width: '80%',
    marginTop: 15,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: '#eee',
    textAlign: 'center'
  },
  contentBody: {
    padding: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 13,
    color: theme.colors.subtext,
    marginTop: 2,
    fontWeight: '500',
  },
  cancelButtonFull: {
    marginTop: 30,
    backgroundColor: '#feebea',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  cancelButtonText: {
    color: '#d32f2f',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default ProfileScreen;
