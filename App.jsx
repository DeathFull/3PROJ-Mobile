import React, { useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import { AuthContextProvider } from './src/context/AuthContext';
import MainDrawer from './src/components/MainDrawer'
import { AuthContext } from './src/context/AuthContext';
const Stack = createStackNavigator();

export default function App() {
    const { isLogged } = useContext(AuthContext);

    return (
        <AuthContextProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    {isLogged ? (
                        <Stack.Screen name="MainDrawer" component={MainDrawer} options={{ headerShown: false }} />
                    ) : (
                        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </AuthContextProvider>
    );
}