import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import { theme } from '../config/theme';
import { commonStyles } from '../shared/styles/commonStyles';
import { toggleLike } from '../services/dbServices';

const { width } = Dimensions.get('window');

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);

  const handleLike = async () => {
    try {
      await toggleLike(1, post.id, liked);
      setLiked(!liked);
      setLikesCount(prev => (liked ? prev - 1 : prev + 1));
    } catch (error) {
      console.log('Like error:', error);
    }
  };

  return (
    <View style={[commonStyles.card, styles.container]}>
      <View style={styles.header}>
        <Image
          source={
            post.profilePic
              ? { uri: post.profilePic }
              : require('../assets/images/Social Media Feed App.png')
          }
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.username || 'Social User'}</Text>
          <Text style={commonStyles.subText}>{post.timestamp || 'Just now'}</Text>
        </View>
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
            name={liked ? "heart" : "hearto"} 
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

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="message1" size={20} color={theme.colors.subtext} />
          <Text style={styles.actionText}>{post.commentsCount || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="sharealt" size={20} color={theme.colors.subtext} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: theme.spacing.s,
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
});

export default PostCard;