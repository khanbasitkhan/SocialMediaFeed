import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import { theme } from '../config/theme';
import { commonStyles } from '../shared/styles/commonStyles';
import {
  toggleLike,
  addComment,
  deletePost,
  getCommentsByPost,
} from '../services/dbServices';

const { width, height } = Dimensions.get('window');

const PostCard = ({ post }) => {
  const currentUser = useSelector(state => state.auth.user);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [isVisible, setIsVisible] = useState(true);

  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentsList, setCommentsList] = useState([]);

  const loadComments = useCallback(async () => {
    try {
      const data = await getCommentsByPost(post.id);
      setCommentsList(data);
    } catch (error) {
      console.log('Error loading comments:', error);
    }
  }, [post.id]);

  useEffect(() => {
    if (commentModalVisible) {
      loadComments();
    }
  }, [commentModalVisible, loadComments]);

  if (!isVisible) return null;

  const handleLike = async () => {
    try {
      await toggleLike(currentUser.id, post.id, liked);
      setLiked(!liked);
      setLikesCount(prev => (liked ? prev - 1 : prev + 1));
    } catch (error) {
      console.log('Like error:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePost(post.id);
            setIsVisible(false);
            Alert.alert('Deleted', 'Post has been removed successfully');
          } catch (error) {
            Alert.alert('Error', 'Could not delete post');
          }
        },
      },
    ]);
  };

  const submitComment = async () => {
    if (newComment.trim().length > 0) {
      try {
        await addComment(currentUser.id, post.id, newComment);
        setCommentsCount(prev => prev + 1);
        setNewComment('');
        loadComments();
      } catch (error) {
        Alert.alert('Error', 'Could not add comment');
      }
    }
  };

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentTextContainer}>
        <Text style={styles.commentUser}>{item.username || 'Anonymous'}</Text>
        <Text style={styles.commentContentText}>{item.content}</Text>
        {console.log(item.content)}
        
      </View>
    </View>
  );

  return (
    <View style={[commonStyles.card, styles.container]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={
              post.profilePic
                ? { uri: post.profilePic }
                : require('../assets/images/Social Media Feed App.png')
            }
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.username}>
              {post.username || 'Social User'}
            </Text>
            <Text style={commonStyles.subText}>
              {post.timestamp || 'Just now'}
            </Text>
          </View>
        </View>

        {currentUser?.id === post.userId && (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
            <Icon name="delete" size={18} color="red" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.contentText}>{post.content}</Text>

      {post.image && (
        <Image
          source={{ uri: post.image }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Icon
            name={liked ? 'heart' : 'hearto'}
            size={20}
            color={liked ? theme.colors.primary : theme.colors.subtext}
          />
          <Text
            style={[
              styles.actionText,
              { color: liked ? theme.colors.primary : theme.colors.subtext },
              liked && styles.boldText,
            ]}
          >
            {likesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setCommentModalVisible(true)}
        >
          <Icon name="message1" size={20} color={theme.colors.subtext} />
          <Text style={styles.actionText}>{commentsCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="sharealt" size={20} color={theme.colors.subtext} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={commentModalVisible}
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comments</Text>
              <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={commentsList}
              renderItem={renderCommentItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.commentsList}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No comments yet.</Text>
              }
            />

            <View style={styles.commentInputWrapper}>
              <View style={styles.commentInputContainer}>
                <Image
                  source={
                    currentUser?.profilePic
                      ? { uri: currentUser.profilePic }
                      : require('../assets/images/Social Media Feed App.png')
                  }
                  style={styles.smallAvatar}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Add a comment..."
                  placeholderTextColor={theme.colors.subtext}
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                />
                <TouchableOpacity
                  onPress={submitComment}
                  disabled={!newComment.trim()}
                >
                  <Text
                    style={[
                      styles.postBtnText,
                      {
                        color: newComment.trim()
                          ? theme.colors.primary
                          : theme.colors.subtext,
                      },
                    ]}
                  >
                    Post
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.m,
    marginVertical: theme.spacing.s,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.s,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.border,
  },
  userInfo: {
    marginLeft: theme.spacing.s,
  },
  username: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  deleteBtn: {
    padding: 5,
  },
  contentText: {
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.s,
  },
  postImage: {
    width: '100%',
    height: width * 0.7,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.s,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.s,
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 6,
  },
  boldText: {
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  commentsList: {
    flex: 1,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  commentTextContainer: {
    backgroundColor: theme.colors.surface,
    padding: 10,
    borderRadius: 15,
    flex: 1,
    elevation: 1,
  },
  commentUser: {
    fontWeight: 'bold',
    fontSize: 13,
    color: theme.colors.primary,
    marginBottom: 2,
  },
  commentContentText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 18,
  },
  commentInputWrapper: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  smallAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    maxHeight: 100,
    color: theme.colors.text,
    fontSize: 15,
  },
  postBtnText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.subtext,
    marginTop: 20,
  },
});

export default PostCard;
