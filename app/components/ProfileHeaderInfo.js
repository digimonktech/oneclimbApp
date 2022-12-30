import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';

import colors from '../config/colors';
import { ScrollView } from 'react-native-gesture-handler';
import AccountSettings from './AccountSettings';
import Coaching from './Coaching';
import Referrals from './Referrals';
import Support from './Support';
import Legal from './Legal';
import LogOut from './LogOut';
import BecomeACoachModal from './BecomeACoachModal';
import Overview from './Overview';
import AboutYou from './AboutYou';
import ReviewAndSubmit from './ReviewAndSubmit';
import CongratsBecomeACoach from './CongratsBecomeACoach';
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import firebase from "firebase/compat/app";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ProfileHeaderInfo = ({ user, userID, userData, setUser }) => {
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const [checked, setChecked] = useState('professionally');
  const [hosting, setHosting] = useState('business');
  const [uniqueInfo, setUniqueInfo] = useState('');
  const [locationData, setLocationData] = useState({});
  const [language, setLanguage] = useState('');

  const [checkedExperience, setCheckedExperience] = useState({
    fivePlus: false,
    exPro: false,
    rockClimber: false,
    begginers: false,
    advanced: false,
    recreational: false,
  });

  const becomeACoachRef = useRef(null);
  const overviewRef = useRef(null);
  const aboutYouRef = useRef(null);
  const reviewRef = useRef(null);
  const congratsRef = useRef(null);

  const registerCoach = async () => {
    updateDoc(doc(db, 'users', user.uid), {
      coachStatus: 'pending',
      sessionHistory: checked,
      hosting_as: hosting,
      unique_qualification: uniqueInfo,
      hosting_location: locationData,
      languages: language,
      standout_experience: checkedExperience,
    }).catch((err) => console.log(err));
  };

  const sendEmail = async () => {
    addDoc(collection(db, 'register_coach_mail'), {
      to: 'uros@heartedapp.com',
      message: {
        subject: 'Application for coach',
        html: `
          <div>
            <h3>
              <span>
                User with user_id: <b>${user.uid}</b>
              </span>
              <br />
              wants to register as coach.
              <br />
              <br />
              <h4>Please approve the status.</h4>
            </h3>
          </div>
        `,
      },
    }).catch((err) => console.log(err));
  };

  return (
    <ScrollView>
      <AccountSettings />
      <Coaching becomeACoachRef={becomeACoachRef} />
      <Referrals />
      <Support />
      <Legal />
      <LogOut setUser={setUser} />
      <BecomeACoachModal modalRef={becomeACoachRef} overviewRef={overviewRef} />
      <Overview
        modalRef={overviewRef}
        aboutYouRef={aboutYouRef}
        checked={checked}
        setChecked={setChecked}
      />
      <AboutYou
        modalRef={aboutYouRef}
        teachingExperience={checked}
        overviewRef={overviewRef}
        reviewRef={reviewRef}
        hosting={hosting}
        setHosting={setHosting}
        setUniqueInfo={setUniqueInfo}
        language={language}
        setLanguage={setLanguage}
        locationData={locationData}
        setLocationData={setLocationData}
        checkedExperience={checkedExperience}
        setCheckedExperience={setCheckedExperience}
      />
      <ReviewAndSubmit
        modalRef={reviewRef}
        congratsRef={congratsRef}
        registerCoach={registerCoach}
      />
      <CongratsBecomeACoach
        modalRef={congratsRef}
        overviewRef={overviewRef}
        aboutYouRef={aboutYouRef}
        reviewRef={reviewRef}
      />
      {/* <View style={styles.container}>
        <View style={styles.statsBox}>
          {userData?.coachStatus === 'approved' ? (
            <TouchableOpacity
              onPress={() => setNewSessionModal(true)}
              style={styles.submit}
            >
              <AppText style={styles.submitButton}>Create new session</AppText>
            </TouchableOpacity>
          ) : null}
        </View>
        <View>
          <BookedSessions user={user} />
          <SessionsArchive user={user} />
        </View>
      </View>
      <Modal
        visible={newSessionModal}
        animationType='slide'
        onRequestClose={() => setNewSessionModal(false)}
        style={{ backgroundColor: colors.white, height: windowHeight }}
      >
        <CloseButton setModal={setNewSessionModal} />
        <RegisterNewSession user={user} />
      </Modal> */}
    </ScrollView>
  );
};

export default ProfileHeaderInfo;

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    alignItems: 'center',
  },
  userName: {
    marginTop: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.hearted2,
    borderRadius: 10,
  },
  userNameText: {
    fontFamily: 'nunitoBold',
    fontSize: 22,
    lineHeight: 24,
    color: colors.black2,
  },
  coachIcon: {
    marginHorizontal: 5,
    marginBottom: 5,
  },
  handle: {
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  handleText: {
    fontFamily: 'nunito',
    fontSize: 14,
    lineHeight: 16,
    color: colors.black2,
    marginLeft: 4,
  },
  bio: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 14,
    alignItems: 'center',
  },
  bioText: {
    fontFamily: 'nunito',
    fontSize: 12,
    lineHeight: 16,
    color: colors.black2,
    flexWrap: 'wrap',
    flexShrink: 1,
    textAlign: 'center',
  },
  badges: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 14,
    alignItems: 'center',
  },
  badgesText: {
    fontFamily: 'nunito',
    fontSize: 12,
    lineHeight: 16,
    color: colors.black2,
    flexWrap: 'wrap',
    flexShrink: 1,
    textAlign: 'left',
  },
  statsBox: {
    flexDirection: 'row',
    height: 65,
    width: '92%',
    marginLeft: 16,
    marginTop: 15,
    marginRight: 16,
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    alignSelf: 'center',
  },
  statsFollowers: {
    marginLeft: 69,
    alignItems: 'center',
  },
  statsFollowing: {
    alignItems: 'center',
    marginRight: 66,
  },
  statsPosts: {
    alignItems: 'center',
  },
  count: {
    color: colors.hearted2,
    fontSize: 20,
    fontFamily: 'nunitoBold',
    lineHeight: 24,
  },
  statsText: {
    fontFamily: 'nunito',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#949494',
  },
  headerBoxModal: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },

  handleBoxModal: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 40,
  },
  handleModal: {
    fontFamily: 'nunito',
    //top: 30,
    alignSelf: 'center',
    fontSize: 18,
    //position: 'absolute',
    fontWeight: '600',
    lineHeight: 22,
    marginLeft: 3,
  },
  submit: {
    alignSelf: 'center',
    backgroundColor: colors.hearted2,
    width: windowWidth * 0.76,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 15,
  },
  submitButton: {
    color: colors.black,
    fontFamily: 'nunitoBold',
    fontWeight: '700',
    fontSize: 16,
  },
});
