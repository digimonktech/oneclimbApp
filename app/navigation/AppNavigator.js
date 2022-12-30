import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import DrawerContent from "../components/DrawerContent";
import AuthContext from "../auth/context";
import { navigationRef } from "./rootNavigation";
import TabNavigator from "./TabNavigator";
import AuthNavigator from "./AuthNavigator";

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  const { user } = useContext(AuthContext);
  //const user = false

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        if (user?.emailVerified) navigationRef?.current?.navigate("Home");
      }}
    >
      <Drawer.Navigator
        screenOptions={{
          drawerPosition: "right",
          headerShown: false,
        }}
        initialRouteName="Home"
        useLegacyImplementation
        drawerContent={(props) => <DrawerContent {...props} />}
      >
        <Drawer.Screen
          name="Home"
          children={({ navigation }) => (
            <>
              {user?.emailVerified ? (
                <TabNavigator />
              ) : (
                <AuthNavigator />
                // <TabNavigator />
              )}
            </>
          )}
          options={{ swipeEnabled: false }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
