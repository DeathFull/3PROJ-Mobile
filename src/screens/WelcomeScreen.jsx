import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from "./LoginPage";

const Stack = createStackNavigator();

function WelcomeScreen() {
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

function WelcomeStack() {
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: {
                backgroundColor: '#D27E00',
            },
            headerTintColor: 'white',
        }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="LoginPage" component={LoginPage} />
        </Stack.Navigator>
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
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#666',
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

export default WelcomeStack;
