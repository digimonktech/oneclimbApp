import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  Keyboard,
  Text,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Analytics from 'expo-firebase-analytics';


//import TouchableAndroidIOS from './TouchableAndroidIOS';
import colors from '../config/colors';

const windowWidth = Dimensions.get('window').width;

const ProfilePostTabs = ({
  admin,
  selectedTab,
  setSelectedTab,
  setFilteredImages,
  uploadedPosts,
  setUploadedPosts,
  setScrollY,
  setPostsLoading,
}) => {
  const [searchActive, setSearchActive] = useState();
  const [searchText, setSearchText] = useState('');

  const searchRef = useRef();

  let tabItems = admin ? ['Posts', 'Saved', 'Mine'] : ['Posts', 'Saved'];

  const searchFilterFunction = (text) => {
    const newData = uploadedPosts?.filter((item) => {
      const itemData = `${item.placeName.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    setFilteredImages(newData);
  };

  useEffect(() => {
    return () => {
      setSearchText('');
      setFilteredImages([]);
      setUploadedPosts([]);
      setScrollY(new Animated.Value(0));
      setPostsLoading(true);
    };
  }, [selectedTab]);

  return (
    <View style={{ flex: 1, zIndex: 1000 }}>
      <View style={styles.container}>
        <View style={styles.tabAndSearch}>
          {!searchActive ? (
            <View style={styles.tabContainer}>
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  marginTop: 2,
                }}
              >
                {tabItems.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index.toString()}
                      style={[
                        styles.singleTab,
                        index === selectedTab ? styles.activeTab : {},
                      ]}
                      onPress={() => {
                        if (index !== selectedTab) {
                          setFilteredImages([]);
                          setUploadedPosts([]);
                          setSelectedTab(index);
                          Analytics.logEvent('account_screen_press', {
                            button: `${tabItems[index]}_tab`,
                          });
                        }
                      }}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          {
                            color:
                              index === selectedTab
                                ? 'rgba(48, 43, 45, 1)'
                                : 'rgba(48, 43, 45, 0.35)',
                          },
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : null}
          <View style={styles.searchContainer}>
            {/* <TouchableAndroidIOS
              onPress={() => {
                if (searchActive) {
                  Keyboard.dismiss();
                  setSearchActive(false);
                } else {
                  setTimeout(() => {
                    searchRef?.current?.focus();
                  }, 200);
                  setSearchActive(true);
                }
              }}
            >
              <TextInput
                ref={searchRef}
                editable={searchActive}
                selectTextOnFocus={searchActive}
                autoCorrect={false}
                style={[
                  styles.input,
                  { width: searchActive ? windowWidth - 45 : 32 },
                ]}
                onChangeText={(value) => {
                  setSearchText(value);
                  searchFilterFunction(value);
                }}
                value={searchText}
                placeholder={searchActive ? 'Search posts' : ''}
              />
              <Feather
                style={styles.searchIcon}
                name="search"
                size={18}
                color={searchActive ? colors.hearted2 : 'black'}
              />
            </TouchableAndroidIOS> */}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfilePostTabs;

const styles = StyleSheet.create({
  tabAndSearch: {
    height: 50,
    width: '100%',
  },
  tabContainer: {
    alignSelf: 'center',
  },
  tabText: {
    fontFamily: 'nunitoBold',
    fontSize: 13,
  },
  searchContainer: {
    height: 40,
    position: 'absolute',
    elevation: 1000,
    zIndex: 1000,
    right: 10,
  },
  searchIcon: {
    right: 19,
    top: '35%',
    alignSelf: 'center',
    position: 'absolute',
  },
  input: {
    height: 34,
    width: 34,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    paddingLeft: 10,
    borderRadius: 5,
    borderColor: '#C8C8C8',
  },
  singleTab: {
    margin: 8,
    padding: 7,
    paddingBottom: 8,
    height: 35,
  },
  activeTab: {
    borderBottomWidth: 2.5,
    borderColor: colors.hearted2,
  },
});
