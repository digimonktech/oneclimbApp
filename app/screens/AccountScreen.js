import React, {
  useCallback,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { StyleSheet } from "react-native";
import AuthContext from "../auth/context";
import { getUserData } from "../api/firebase";
import ProfileHeader from "../components/ProfileHeader";
import ProfileHeaderInfo from "../components/ProfileHeaderInfo";
import Screen from "../components/Screen";
import { getAuth } from "firebase/auth";

function AccountScreen({ route }) {
  const auth = getAuth();
  const { user, setUser } = useContext(AuthContext);
  const isMounted = useRef(true);

  const [avatar, setAvatar] = useState();
  const [userData, setUserData] = useState();
  const [update, setUpdate] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(true);
  let userID = route?.params?.userID || user.uid;

  const handleUserInfo = async () => {
    if (userID && isMounted.current) {
      const userInfo = await getUserData(userID);
      setUserData(userInfo);
      setAvatar(userInfo.photoURL);
    }
  };

  const updateUserInfo = useCallback(() => setUser(auth.currentUser), [update]);

  useEffect(() => {
    isMounted.current = true;

    updateUserInfo();
    handleUserInfo();
    setUser(auth.currentUser);
    //console.log('USER > ',user)
    //console.log('USER DATA> ',userData)
  }, []);

  return (
    <Screen style={styles.container}>
      <ProfileHeader
        avatar={avatar}
        user={user}
        userData={userData}
        userID={userID}
        setUserData={setUserData}
        setAvatar={setAvatar}
        updateUserInfo={updateUserInfo}
        setProfileLoaded={setProfileLoaded}
      />
      <ProfileHeaderInfo
        user={user}
        userData={userData}
        userID={userID}
        setUser={setUser}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
});

export default AccountScreen;
