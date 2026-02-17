// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Dimensions,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/AntDesign';

// import { theme } from '../config/theme';
// import { commonStyles } from '../shared/styles/commonStyles';
// import { toggleLike } from '../services/dbServices';

// const { width } = Dimensions.get('window');

// const PostCard = ({ post }) => {
//   const [liked, setLiked] = useState(false);
//   const [likesCount, setLikesCount] = useState(post.likesCount || 0);

//   const handleLike = async () => {
//     try {
//       await toggleLike(1, post.id, liked);
//       setLiked(!liked);
//       setLikesCount(prev => (liked ? prev - 1 : prev + 1));
//     } catch (error) {
//       console.log('Like error:', error);
//     }
//   };

//   return (
//     <View style={[commonStyles.card, styles.container]}>
//       <View style={styles.header}>
//         <Image
//           source={
//             post.profilePic
//               ? { uri: post.profilePic }
//               : require('../assets/images/Social Media Feed App.png')
//           }
//           style={styles.avatar}
//         />
//         <View style={styles.userInfo}>
//           <Text style={styles.username}>{post.username || 'Social User'}</Text>
//           <Text style={commonStyles.subText}>{post.timestamp || 'Just now'}</Text>
//         </View>
//       </View>

//       <Text style={styles.contentText}>{post.content}</Text>

//       {post.image && (
//         <Image
//           source={{ uri: post.image }}
//           style={styles.postImage}
//           resizeMode="cover"
//         />
//       )}

//       <View style={styles.footer}>
//         <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
//           <Icon
//             name={liked ? "heart" : "hearto"}
//             size={20}
//             color={liked ? theme.colors.primary : theme.colors.subtext}
//           />
//           <Text
//             style={[
//               styles.actionText,
//               { color: liked ? theme.colors.primary : theme.colors.subtext },
//               liked && styles.boldText,
//             ]}
//           >
//             {likesCount}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.actionButton}>
//           <Icon name="message1" size={20} color={theme.colors.subtext} />
//           <Text style={styles.actionText}>{post.commentsCount || 0}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.actionButton}>
//           <Icon name="sharealt" size={20} color={theme.colors.subtext} />
//           <Text style={styles.actionText}>Share</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginHorizontal: theme.spacing.m,
//     marginVertical: theme.spacing.s,
//     backgroundColor: theme.colors.surface,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: theme.spacing.s,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: theme.colors.border,
//   },
//   userInfo: {
//     marginLeft: theme.spacing.s,
//   },
//   username: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: theme.colors.text,
//   },
//   contentText: {
//     fontSize: 15,
//     color: theme.colors.text,
//     lineHeight: 20,
//     marginBottom: theme.spacing.s,
//   },
//   postImage: {
//     width: '100%',
//     height: width * 0.7,
//     borderRadius: theme.borderRadius.m,
//     marginBottom: theme.spacing.s,
//   },
//   footer: {
//     flexDirection: 'row',
//     borderTopWidth: 1,
//     borderTopColor: theme.colors.border,
//     paddingTop: theme.spacing.s,
//     justifyContent: 'space-between',
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 5,
//   },
//   actionText: {
//     fontSize: 14,
//     marginLeft: 6,
//   },
//   boldText: {
//     fontWeight: 'bold',
//   },
// });

// export default PostCard;

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/AntDesign';
// import { useSelector } from 'react-redux';
// import { theme } from '../config/theme';
// import { commonStyles } from '../shared/styles/commonStyles';
// import { toggleLike, addComment } from '../services/dbServices';

// const { width } = Dimensions.get('window');

// const PostCard = ({ post }) => {
//   const currentUser = useSelector(state => state.auth.user);
//   const [liked, setLiked] = useState(false);
//   const [likesCount, setLikesCount] = useState(post.likesCount || 0);
//   const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);

//   const handleLike = async () => {
//     try {
//       await toggleLike(currentUser.id, post.id, liked);
//       setLiked(!liked);
//       setLikesCount(prev => (liked ? prev - 1 : prev + 1));
//     } catch (error) {
//       console.log('Like error:', error);
//     }
//   };

//   const handleComment = () => {
//     Alert.prompt(
//       'Add Comment',
//       'Write your thought on this post:',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Post',
//           onPress: async text => {
//             if (text && text.trim().length > 0) {
//               try {
//                 await addComment(currentUser.id, post.id, text);
//                 setCommentsCount(prev => prev + 1);
//                 Alert.alert('Success', 'Comment added!');
//               } catch (error) {
//                 Alert.alert('Error', 'Could not add comment');
//               }
//             }
//           },
//         },
//       ],
//       'plain-text',
//     );
//   };

//   return (
//     <View style={[commonStyles.card, styles.container]}>
//       <View style={styles.header}>
//         <Image
//           source={
//             post.profilePic
//               ? { uri: post.profilePic }
//               : require('../assets/images/Social Media Feed App.png')
//           }
//           style={styles.avatar}
//         />
//         <View style={styles.userInfo}>
//           <Text style={styles.username}>{post.username || 'Social User'}</Text>
//           <Text style={commonStyles.subText}>
//             {post.timestamp || 'Just now'}
//           </Text>
//         </View>
//       </View>

//       <Text style={styles.contentText}>{post.content}</Text>

//       {post.image && (
//         <Image
//           source={{ uri: post.image }}
//           style={styles.postImage}
//           resizeMode="cover"
//         />
//       )}

//       <View style={styles.footer}>
//         <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
//           <Icon
//             name={liked ? 'heart' : 'hearto'}
//             size={20}
//             color={liked ? theme.colors.primary : theme.colors.subtext}
//           />
//           <Text
//             style={[
//               styles.actionText,
//               { color: liked ? theme.colors.primary : theme.colors.subtext },
//               liked && styles.boldText,
//             ]}
//           >
//             {likesCount}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
//           <Icon name="message1" size={20} color={theme.colors.subtext} />
//           <Text style={styles.actionText}>{commentsCount}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.actionButton}>
//           <Icon name="sharealt" size={20} color={theme.colors.subtext} />
//           <Text style={styles.actionText}>Share</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginHorizontal: theme.spacing.m,
//     marginVertical: theme.spacing.s,
//     backgroundColor: theme.colors.surface,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: theme.spacing.s,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: theme.colors.border,
//   },
//   userInfo: {
//     marginLeft: theme.spacing.s,
//   },
//   username: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: theme.colors.text,
//   },
//   contentText: {
//     fontSize: 15,
//     color: theme.colors.text,
//     lineHeight: 20,
//     marginBottom: theme.spacing.s,
//   },
//   postImage: {
//     width: '100%',
//     height: width * 0.7,
//     borderRadius: theme.borderRadius.m,
//     marginBottom: theme.spacing.s,
//   },
//   footer: {
//     flexDirection: 'row',
//     borderTopWidth: 1,
//     borderTopColor: theme.colors.border,
//     paddingTop: theme.spacing.s,
//     justifyContent: 'space-between',
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 5,
//   },
//   actionText: {
//     fontSize: 14,
//     marginLeft: 6,
//   },
//   boldText: {
//     fontWeight: 'bold',
//   },
// });

// export default PostCard;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import { theme } from '../config/theme';
import { commonStyles } from '../shared/styles/commonStyles';
import { toggleLike, addComment, deletePost } from '../services/dbServices';

const { width } = Dimensions.get('window');

const PostCard = ({ post }) => {
  const currentUser = useSelector(state => state.auth.user);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [isVisible, setIsVisible] = useState(true);

  
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

  const handleComment = () => {
    Alert.prompt(
      'Add Comment',
      'Write your thought on this post:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Post',
          onPress: async text => {
            if (text && text.trim().length > 0) {
              try {
                await addComment(currentUser.id, post.id, text);
                setCommentsCount(prev => prev + 1);
                Alert.alert('Success', 'Comment added!');
              } catch (error) {
                Alert.alert('Error', 'Could not add comment');
              }
            }
          },
        },
      ],
      'plain-text',
    );
  };

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

        <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
          <Icon name="message1" size={20} color={theme.colors.subtext} />
          <Text style={styles.actionText}>{commentsCount}</Text>
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
    justifyContent: 'space-between', // Change to allow delete icon on right
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
});

export default PostCard;
