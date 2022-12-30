import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';

import AuthContext from '../auth/context';
import Posts from '../components/Posts';
import Saved from '../components/Saved';
import Mine from '../components/Mine';

const PostTabsContent = ({
  userID,
  admin,
  selectedTab,
  following,
  setFocused,
  blockedUsers,
  followingModal,
  update,
  setUpdate,
  userData,
  scrollY,
  uploadedPosts,
  setUploadedPosts,
  filteredImages,
  setFilteredImages,
  setPostsLoading,
  postsLoading,
}) => {
  const { user } = useContext(AuthContext);

  const renderResults = () => {
    switch (selectedTab) {
      case 0:
        return (
          <>
            {admin ? (
              <Posts
                following={following}
                setUploadedPosts={setUploadedPosts}
                setFilteredImages={setFilteredImages}
                filteredImages={filteredImages}
                uploadedPosts={uploadedPosts}
                setFocused={setFocused}
                followingModal={followingModal}
                blockedUsers={blockedUsers}
                scrollY={scrollY}
                postsLoading={postsLoading}
                setPostsLoading={setPostsLoading}
              />
            ) : (
              <Mine
                setUploadedPosts={setUploadedPosts}
                setFilteredImages={setFilteredImages}
                filteredImages={filteredImages}
                userID={userID}
                user={user}
                update={update}
                setUpdate={setUpdate}
                blockedUsers={blockedUsers}
                userData={userData}
                scrollY={scrollY}
                postsLoading={postsLoading}
                setPostsLoading={setPostsLoading}
              />
            )}
          </>
        );
      case 1:
        return (
          <Saved
            setUploadedPosts={setUploadedPosts}
            setFilteredImages={setFilteredImages}
            filteredImages={filteredImages}
            userID={userID}
            uploadedPosts={uploadedPosts}
            blockedUsers={blockedUsers}
            scrollY={scrollY}
            postsLoading={postsLoading}
            setPostsLoading={setPostsLoading}
          />
        );
      case 2:
        return (
          <Mine
            setUploadedPosts={setUploadedPosts}
            setFilteredImages={setFilteredImages}
            filteredImages={filteredImages}
            userID={userID}
            user={user}
            update={update}
            setUpdate={setUpdate}
            blockedUsers={blockedUsers}
            userData={userData}
            scrollY={scrollY}
            postsLoading={postsLoading}
            setPostsLoading={setPostsLoading}
          />
        );
      default:
        return <AppText style={styles.tabSelected}>Posts</AppText>;
    }
  };

  return renderResults();
};

export default PostTabsContent;

const styles = StyleSheet.create({
  tabSelected: {
    alignSelf: 'center',
    top: 50,
  },
});
