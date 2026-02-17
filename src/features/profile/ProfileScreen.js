import React, { useCallback, useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { theme } from '../../config/theme';
import { getUserAnalytics } from '../../services/dbServices';
import { commonStyles } from '../../shared/styles/commonStyles';
import { logout } from '../../store/slices/authSlice';

const ProfileScreen = ({ navigation }) => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
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

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const handleLogout = () => {
    dispatch(logout());
    navigation.replace('Auth');
  };

  return (
    <ScrollView style={commonStyles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="logout" size={20} color="red" />
        </TouchableOpacity>

        <View style={styles.profileInfo}>
          <Image
            source={
              user?.profilePic
                ? { uri: user.profilePic }
                : require('../../assets/images/Social Media Feed App.png')
            }
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user?.username || 'User Name'}</Text>
          <Text style={commonStyles.subText}>{user?.phone || 'No Phone'}</Text>
          <View style={styles.ageBadge}>
            <Text style={styles.ageText}>{user?.age || '--'} Years Old</Text>
          </View>
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
  profileInfo: { alignItems: 'center' },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: theme.colors.primary,
    marginBottom: 15,
  },
  userName: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
  ageBadge: {
    backgroundColor: theme.colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    marginTop: 10,
  },
  ageText: { color: theme.colors.primary, fontWeight: '600', fontSize: 12 },
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
});

export default ProfileScreen;




// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
// import Icon from 'react-native-vector-icons/AntDesign';
// import { theme } from '../../../config/theme';
// import { useSelector } from 'react-redux';
// import { toggleLike, addComment, getCommentsByPost } from '../../../services/dbServices';

// const PostCard = ({ post }) => {
//   const user = useSelector((state) => state.auth.user);
//   const [liked, setLiked] = useState(false);
//   const [showComments, setShowComments] = useState(false);
//   const [commentText, setCommentText] = useState('');
//   const [comments, setComments] = useState([]);

//   const handleCommentSubmit = async () => {
//     if (!commentText.trim()) return;
//     try {
//       await addComment(post.id, user.id, commentText);
//       setCommentText('');
//       loadComments(); // Refresh list
//     } catch (error) {
//       console.log('Comment error:', error);
//     }
//   };

//   const loadComments = async () => {
//     const data = await getCommentsByPost(post.id);
//     setComments(data);
//   };

//   useEffect(() => {
//     if (showComments) loadComments();
//   }, [showComments]);

//   return (
//     <View style={styles.cardContainer}>
//       {/* Post Header & Content (Same as before) */}
//       <Text style={styles.contentText}>{post.content}</Text>

//       {/* Action Buttons */}
//       <View style={styles.footer}>
//         <TouchableOpacity onPress={() => setLiked(!liked)} style={styles.actionBtn}>
//           <Icon name={liked ? "heart" : "hearto"} size={20} color={liked ? theme.colors.primary : theme.colors.subtext} />
//           <Text style={styles.actionText}>Like</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => setShowComments(!showComments)} style={styles.actionBtn}>
//           <Icon name="message1" size={20} color={theme.colors.subtext} />
//           <Text style={styles.actionText}>Comment</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Comment Section */}
//       {showComments && (
//         <View style={styles.commentSection}>
//           <View style={styles.inputRow}>
//             <TextInput
//               style={styles.commentInput}
//               placeholder="Write a comment..."
//               value={commentText}
//               onChangeText={setCommentText}
//             />
//             <TouchableOpacity onPress={handleCommentSubmit}>
//               <Icon name="arrowright" size={24} color={theme.colors.primary} />
//             </TouchableOpacity>
//           </View>

//           {comments.map((item, index) => (
//             <View key={index} style={styles.commentItem}>
//               <Text style={styles.commentUser}>{item.username}: </Text>
//               <Text style={styles.commentText}>{item.text}</Text>
//             </View>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   cardContainer: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 10 },
//   footer: { flexDirection: 'row', marginTop: 10, borderTopWidth: 0.5, borderColor: '#eee', paddingTop: 10 },
//   actionBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
//   actionText: { marginLeft: 5, color: theme.colors.subtext },
//   commentSection: { marginTop: 10, backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8 },
//   inputRow: { flexDirection: 'row', alignItems: 'center' },
//   commentInput: { flex: 1, backgroundColor: '#fff', padding: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', marginRight: 10 },
//   commentItem: { flexDirection: 'row', marginTop: 8 },
//   commentUser: { fontWeight: 'bold', fontSize: 13 },
//   commentText: { fontSize: 13, color: '#444' }
// });

// export default PostCard;