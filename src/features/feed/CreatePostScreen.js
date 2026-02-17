import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/AntDesign';
import { theme } from '../../config/theme';
import { commonStyles } from '../../shared/styles/commonStyles';
import { createPost } from '../../services/dbServices';

const CreatePostScreen = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  
  const user = useSelector((state) => state.auth.user);

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const handlePost = async () => {
    if (!content && !image) {
      Alert.alert('Empty Post', 'Please add some text or an image to post.');
      return;
    }

    if (!user || !user.id) {
      Alert.alert('Error', 'User session not found. Please login again.');
      return;
    }

    setLoading(true);
    try {
      
      await createPost(user.id, content, image);
      Alert.alert('Success', 'Your post is live!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={commonStyles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity 
          style={[styles.postBtn, (!content && !image) && styles.disabledBtn]} 
          onPress={handlePost}
          disabled={loading || (!content && !image)}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.postBtnText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          placeholderTextColor={theme.colors.subtext}
          multiline
          value={content}
          onChangeText={setContent}
        />

        {image && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity 
              style={styles.removeImageBtn} 
              onPress={() => setImage(null)}
            >
              <Icon name="closecircle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.attachmentBtn} onPress={pickImage}>
          <Icon name="picture" size={24} color={theme.colors.primary} />
          <Text style={styles.attachmentText}>Add Photo</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  postBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  disabledBtn: {
    backgroundColor: theme.colors.subtext,
    opacity: 0.5,
  },
  container: {
    padding: theme.spacing.m,
  },
  input: {
    fontSize: 18,
    color: theme.colors.text,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  imagePreviewContainer: {
    marginTop: 20,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 250,
    borderRadius: theme.borderRadius.m,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  attachmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    padding: 15,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.m,
    borderStyle: 'dashed',
  },
  attachmentText: {
    marginLeft: 10,
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default CreatePostScreen;