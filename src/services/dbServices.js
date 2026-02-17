// import SQLite from 'react-native-sqlite-storage';

// const db = SQLite.openDatabase(
//   { name: 'SocialFeed.db', location: 'default' },
//   () => console.log('Database Connected Successfully'),
//   (err) => console.log('Database Error: ', err)
// );

// export const initDatabase = () => {
//   db.transaction((tx) => {
//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS users (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         username TEXT UNIQUE,
//         gender TEXT,
//         phone TEXT UNIQUE,
//         password TEXT,
//         profilePic TEXT
//       );`
//     );

//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS posts (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         userId INTEGER,
//         content TEXT,
//         image TEXT,
//         likesCount INTEGER DEFAULT 0,
//         commentsCount INTEGER DEFAULT 0,
//         timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (userId) REFERENCES users (id)
//       );`
//     );

//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS likes (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         userId INTEGER,
//         postId INTEGER,
//         UNIQUE(userId, postId)
//       );`
//     );

//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS comments (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         userId INTEGER,
//         postId INTEGER,
//         commentText TEXT,
//         timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
//       );`
//     );
//   });
// };

// export const registerUser = (username, gender, phone, password, profilePic) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         'INSERT INTO users (username, gender, phone, password, profilePic) VALUES (?, ?, ?, ?, ?)',
//         [username, gender, phone, password, profilePic],
//         (_, results) => resolve(results),
//         (_, err) => reject(err)
//       );
//     });
//   });
// };

// export const loginUser = (identifier, password) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         'SELECT * FROM users WHERE (username = ? OR phone = ?) AND password = ?',
//         [identifier, identifier, password],
//         (_, { rows }) => resolve(rows.length > 0 ? rows.item(0) : null),
//         (_, err) => reject(err)
//       );
//     });
//   });
// };

// export const updateUserProfile = (userId, username, phone, profilePic) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         'UPDATE users SET username = ?, phone = ?, profilePic = ? WHERE id = ?',
//         [username, phone, profilePic, userId],
//         (_, results) => resolve(results),
//         (_, err) => reject(err)
//       );
//     });
//   });
// };

// export const createPost = (userId, content, image) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         'INSERT INTO posts (userId, content, image) VALUES (?, ?, ?)',
//         [userId, content, image],
//         (_, results) => resolve(results),
//         (_, err) => reject(err)
//       );
//     });
//   });
// };

// export const getAllPosts = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         `SELECT posts.*, users.username, users.profilePic
//          FROM posts
//          JOIN users ON posts.userId = users.id
//          ORDER BY posts.id DESC`,
//         [],
//         (_, { rows }) => {
//           let posts = [];
//           for (let i = 0; i < rows.length; i++) posts.push(rows.item(i));
//           resolve(posts);
//         },
//         (_, err) => reject(err)
//       );
//     });
//   });
// };

// export const deletePost = (postId) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql('DELETE FROM posts WHERE id = ?', [postId], () => resolve(), (_, err) => reject(err));
//       tx.executeSql('DELETE FROM likes WHERE postId = ?', [postId]);
//       tx.executeSql('DELETE FROM comments WHERE postId = ?', [postId]);
//     });
//   });
// };

// export const toggleLike = (userId, postId, isCurrentlyLiked) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       if (isCurrentlyLiked) {
//         tx.executeSql('DELETE FROM likes WHERE userId = ? AND postId = ?', [userId, postId]);
//         tx.executeSql('UPDATE posts SET likesCount = likesCount - 1 WHERE id = ?', [postId]);
//       } else {
//         tx.executeSql('INSERT INTO likes (userId, postId) VALUES (?, ?)', [userId, postId]);
//         tx.executeSql('UPDATE posts SET likesCount = likesCount + 1 WHERE id = ?', [postId]);
//       }
//     }, (err) => reject(err), () => resolve());
//   });
// };

// export const addComment = (userId, postId, text) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql('INSERT INTO comments (userId, postId, commentText) VALUES (?, ?, ?)', [userId, postId, text]);
//       tx.executeSql('UPDATE posts SET commentsCount = commentsCount + 1 WHERE id = ?', [postId]);
//     }, (err) => reject(err), () => resolve());
//   });
// };

// export const getUserAnalytics = (userId) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         'SELECT SUM(likesCount) as totalLikes, SUM(commentsCount) as totalComments FROM posts WHERE userId = ?',
//         [userId],
//         (_, { rows }) => resolve(rows.item(0)),
//         (_, err) => reject(err)
//       );
//     });
//   });
// };

// export const getCommentsByPost = (postId) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         'SELECT comments.*, users.username FROM comments JOIN users ON comments.userId = users.id WHERE postId = ? ORDER BY timestamp DESC',
//         [postId],
//         (_, { rows }) => {
//           let comments = [];
//           for (let i = 0; i < rows.length; i++) comments.push(rows.item(i));
//           resolve(comments);
//         },
//         (_, error) => reject(error)
//       );
//     });
//   });
// }

import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'SocialFeed.db', location: 'default' },
  () => console.log('Database Connected Successfully'),
  err => console.log('Database Error: ', err),
);

export const initDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        gender TEXT,
        phone TEXT UNIQUE,
        password TEXT,
        profilePic TEXT
      );`,
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        content TEXT,
        image TEXT,
        likesCount INTEGER DEFAULT 0,
        commentsCount INTEGER DEFAULT 0,
        timestamp DATETIME DEFAULT (datetime('now','localtime')),
        FOREIGN KEY (userId) REFERENCES users (id)
      );`,
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        postId INTEGER,
        UNIQUE(userId, postId)
      );`,
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        postId INTEGER,
        commentText TEXT,
        timestamp DATETIME DEFAULT (datetime('now','localtime'))
      );`,
    );
  });
};

export const registerUser = (username, gender, phone, password, profilePic) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO users (username, gender, phone, password, profilePic) VALUES (?, ?, ?, ?, ?)',
        [username, gender, phone, password, profilePic],
        (_, results) => resolve(results),
        (_, err) => reject(err),
      );
    });
  });
};

export const loginUser = (identifier, password) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE (username = ? OR phone = ?) AND password = ?',
        [identifier, identifier, password],
        (_, { rows }) => resolve(rows.length > 0 ? rows.item(0) : null),
        (_, err) => reject(err),
      );
    });
  });
};

export const createPost = (userId, content, image) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO posts (userId, content, image) VALUES (?, ?, ?)',
        [userId, content, image],
        (_, results) => resolve(results),
        (_, err) => reject(err),
      );
    });
  });
};

export const getAllPosts = currentUserId => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT posts.*, users.username, users.profilePic,
         (SELECT COUNT(*) FROM likes WHERE likes.postId = posts.id AND likes.userId = ?) as isLiked,
         strftime('%Y-%m-%d %I:%M %p', posts.timestamp) as formattedTime
         FROM posts 
         JOIN users ON posts.userId = users.id 
         ORDER BY posts.id DESC`,
        [currentUserId],
        (_, { rows }) => {
          let posts = [];
          for (let i = 0; i < rows.length; i++) posts.push(rows.item(i));
          resolve(posts);
        },
        (_, err) => reject(err),
      );
    });
  });
};

export const toggleLike = (userId, postId, isCurrentlyLiked) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        if (isCurrentlyLiked) {
          tx.executeSql('DELETE FROM likes WHERE userId = ? AND postId = ?', [
            userId,
            postId,
          ]);
          tx.executeSql(
            'UPDATE posts SET likesCount = MAX(0, likesCount - 1) WHERE id = ?',
            [postId],
          );
        } else {
          tx.executeSql(
            'INSERT OR IGNORE INTO likes (userId, postId) VALUES (?, ?)',
            [userId, postId],
          );
          tx.executeSql(
            'UPDATE posts SET likesCount = likesCount + 1 WHERE id = ?',
            [postId],
          );
        }
      },
      err => reject(err),
      () => resolve(),
    );
  });
};

export const addComment = (userId, postId, text) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'INSERT INTO comments (userId, postId, commentText) VALUES (?, ?, ?)',
          [userId, postId, text],
        );
        tx.executeSql(
          'UPDATE posts SET commentsCount = commentsCount + 1 WHERE id = ?',
          [postId],
        );
      },
      err => reject(err),
      () => resolve(),
    );
  });
};


export const getUserAnalytics = (userId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT SUM(likesCount) as totalLikes, SUM(commentsCount) as totalComments FROM posts WHERE userId = ?',
        [userId],
        (_, { rows }) => resolve(rows.item(0)),
        (_, err) => reject(err)
      );
    });
  });
};

export const getCommentsByPost = (postId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT comments.*, users.username FROM comments JOIN users ON comments.userId = users.id WHERE postId = ? ORDER BY timestamp DESC',
        [postId],
        (_, { rows }) => {
          let comments = [];
          for (let i = 0; i < rows.length; i++) comments.push(rows.item(i));
          resolve(comments);
        },
        (_, error) => reject(error)
      );
    });
  });
}

export const updateUserProfile = (userId, username, phone, profilePic) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE users SET username = ?, phone = ?, profilePic = ? WHERE id = ?',
        [username, phone, profilePic, userId],
        (_, results) => resolve(results),
        (_, err) => reject(err)
      );
    });
  });
};

export const deletePost = (postId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM posts WHERE id = ?', [postId], () => resolve(), (_, err) => reject(err));
      tx.executeSql('DELETE FROM likes WHERE postId = ?', [postId]);
      tx.executeSql('DELETE FROM comments WHERE postId = ?', [postId]);
    });
  });
};


export const checkIsLiked = (userId, postId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM likes WHERE userId = ? AND postId = ?',
        [userId, postId],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(true); 
          } else {
            resolve(false);
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const deleteComment = (commentId, postId) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        
        tx.executeSql(
          'DELETE FROM comments WHERE id = ?',
          [commentId]
        );
        
        
        tx.executeSql(
          'UPDATE posts SET commentsCount = MAX(0, commentsCount - 1) WHERE id = ?',
          [postId]
        );
      },
      err => reject(err), 
      () => resolve()    
    );
  });
};
export const updateComment = (commentId, newText) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE comments SET commentText = ? WHERE id = ?',
        [newText, commentId],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};