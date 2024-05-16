import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SettingsScreen from '../screens/SettingsScreen';
import MyAccount from "../screens/MyAccount";

const Drawer = createDrawerNavigator();
// main drawer permettant de faire la navigation avec le burger dans le header
export default function MainDrawer() {
    return (
        <Drawer.Navigator initialRouteName="MyAccount"
                          screenOptions={{
                              headerStyle: {
                                  backgroundColor: '#D27E00',
                              },
                              headerTintColor: 'white',
                          }}
        >
            <Drawer.Screen name="Mon Compte" component={MyAccount} />
            <Drawer.Screen name="Paramètres" component={SettingsScreen} />
        </Drawer.Navigator>
    );
}
