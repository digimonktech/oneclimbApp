import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useRef } from 'react';
import { Image } from 'react-native';
import colors from '../config/colors';
import GymProfile from './GymProfile';

const GymCard = ({ item, setGym, allGymsRef }) => {
  const gymProfileRef = useRef(null);

  return (
    <>
      <TouchableOpacity onPress={() => gymProfileRef.current?.open()}>
        <View style={styles.container}>
          <Image style={styles.image} source={require('../assets/scena.png')} />
        </View>
        <Text style={styles.locationText}>{item.name}</Text>
        <Text style={styles.locationText}>{`${item.address.slice(
          0,
          22
        )}...`}</Text>
      </TouchableOpacity>
      <GymProfile
        modalRef={gymProfileRef}
        item={item}
        setGym={setGym}
        allGymsRef={allGymsRef}
      />
    </>
  );
};

export default GymCard;

const styles = StyleSheet.create({
  container: {
    height: 160,
    width: 160,
    borderRadius: 16,
    marginRight: 10,
  },
  image: {
    height: 160,
    width: 160,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  locationText: {
    fontFamily: 'nunitoBold',
    fontSize: 12,
    lineHeight: 14,
    marginTop: 5,
    color: colors.darkGray,
  },
});
