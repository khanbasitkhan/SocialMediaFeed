// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   RefreshControl,
// } from 'react-native';
// import { theme } from '../../config/theme';
// import { commonStyles } from '../../shared/styles/commonStyles';
// import PostCard from '../../components/PostCard';
// import { getAllPosts } from '../../services/dbServices';
// import { MOCK_POSTS } from '../../data/mockPosts';

// const FeedScreen = ({ navigation }) => {
//   const [posts, setPosts] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);

// //   const fetchFeedData = async () => {
// //     try {
// //       const dbPosts = await getAllPosts();

// //       setPosts([...dbPosts, ...MOCK_POSTS]);
// //     } catch (error) {
// //       console.log('Error fetching posts:', error);
// //       setPosts(MOCK_POSTS);
// //     }
// //   };
// const fetchFeedData = async () => {
//   try {
//     const dbPosts = await getAllPosts();

//     setPosts([...dbPosts.reverse(), ...MOCK_POSTS]);
//   } catch (error) {
//     setPosts(MOCK_POSTS);
//   }
// }

//   useEffect(() => {
//     fetchFeedData();
//   }, []);

//   const onRefresh = React.useCallback(async () => {
//     setRefreshing(true);
//     await fetchFeedData();
//     setRefreshing(false);
//   }, []);

//   const renderHeader = () => (
//     <View style={styles.header}>
//       <Image
//         source={require('../../assets/images/Social Media Feed App.png')}
//         style={styles.smallLogo}
//         resizeMode="contain"
//       />
//       <Text></Text>
//       <TouchableOpacity
//         style={styles.createButton}
//         onPress={() => navigation.navigate('CreatePost')}
//       >
//         <Text style={styles.createButtonText}>+ New Post</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={commonStyles.safeArea}>
//       {renderHeader()}

//       <FlatList
//         data={posts}
//         keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
//         renderItem={({ item }) => <PostCard post={item} />}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyState}>
//             <Text style={commonStyles.subText}>No posts yet. Be the first to share!</Text>
//           </View>
//         }
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: theme.spacing.m,
//     paddingVertical: theme.spacing.s,
//     backgroundColor: theme.colors.surface,
//     borderBottomWidth: 1,
//     borderBottomColor: theme.colors.border,
//   },
//   smallLogo: {
//     width: 40,
//     height: 40,
//   },
//   createButton: {
//     backgroundColor: theme.colors.primary,
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   createButtonText: {
//     color: '#FFF',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   emptyState: {
//     marginTop: 100,
//     alignItems: 'center',
//   },
// });

// export default FeedScreen;

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSelector } from 'react-redux';
import { theme } from '../../config/theme';
import { commonStyles } from '../../shared/styles/commonStyles';
import PostCard from '../../components/PostCard';
import { getAllPosts } from '../../services/dbServices';
import { MOCK_POSTS } from '../../data/mockPosts';

const FeedScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const currentUser = useSelector(state => state.auth.user);

  const fetchFeedData = useCallback(async () => {
    try {
      const dbPosts = await getAllPosts(currentUser?.id);
      setPosts([...dbPosts, ...MOCK_POSTS]);
    } catch (error) {
      setPosts(MOCK_POSTS);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    fetchFeedData();
  }, [fetchFeedData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFeedData();
    setRefreshing(false);
  }, [fetchFeedData]);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <Image
          source={require('../../assets/images/Social Media Feed App.png')}
          style={styles.smallLogo}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>
            {currentUser?.username || 'User'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Text style={styles.createButtonText}>+ New Post</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={commonStyles.safeArea}>
      {renderHeader()}
      <FlatList
        data={posts}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={commonStyles.subText}>No posts yet!</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  textContainer: { marginLeft: 10 },
  welcomeText: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text },
  smallLogo: { width: 35, height: 35 },
  createButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  listContent: { paddingBottom: 20 },
  emptyState: { marginTop: 100, alignItems: 'center' },
});

export default FeedScreen;
