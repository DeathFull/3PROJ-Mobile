import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './LoginPage';

const Stack = createStackNavigator();

export default function WelcomeScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Welcome" component={WelcomeContent} options={{
                headerStyle: {
                    backgroundColor: '#D27E00',
                },
                headerTintColor: 'white',
            }} />
            <Stack.Screen name="LoginPage" component={LoginPage} options={{headerShown:false}} />
        </Stack.Navigator>
    );
}

function WelcomeContent() {
    const navigation = useNavigation();

    const goToLoginPage = () => {
        navigation.navigate('LoginPage');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>UniFinance</Text>
            <TouchableOpacity style={styles.button} onPress={goToLoginPage}>
                <Text style={styles.buttonText}>Je m'authentifie</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#D27E00',
        padding: 12,
        borderRadius: 8,
        marginTop: 24,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
