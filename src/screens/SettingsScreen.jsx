import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkLoggedIn } from '../components/checkLoggedIn';
import instance from '../api/ApiConfig';

export default function SettingsScreen({ navigation }) {
    useEffect(() => {
        const checkLoginStatus = async () => {
            const { isLoggedIn } = await checkLoggedIn();
            if (!isLoggedIn) {
                navigation.navigate('WelcomeScreen');
            }
        };

        checkLoginStatus();
    }, []);

    const handleLogout = async () => {
        try {
            await clearAsyncStorage();
            navigation.navigate('WelcomeScreen');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleEditProfile = () => {
        navigation.navigate('EditProfileScreen');
    };

    const handleDeleteAccount = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userData = await AsyncStorage.getItem('userData');
            const userId = JSON.parse(userData)._id;

            await instance.delete(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            await clearAsyncStorage();
            navigation.navigate('WelcomeScreen');
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const clearAsyncStorage = async () => {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Paramètres</Text>
            <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
                <Text style={styles.buttonText}>Modifier le profil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Se déconnecter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteAccount}>
                <Text style={styles.buttonText}>Supprimer le compte</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 40,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#D27E00',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
        width: '80%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: 'red',
    },
});
