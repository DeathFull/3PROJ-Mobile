import React, { useContext, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import instance from '../api/ApiConfig';
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import MyAccount from "./MyAccount";
import AsyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";

const Stack = createStackNavigator();

function LoginPage() {
    const navigation = useNavigation();
    const [selectedButton, setSelectedButton] = useState('login');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const authContext = useContext(AuthContext);

    const handleButtonPress = (buttonType) => {
        setSelectedButton(buttonType);
    };

    const handleLogin = () => {
        instance.post('users/login', { email, password })
            .then(response => {
                const token = response.data.token;
                authContext.setToken(token);
                setSuccessMessage("Connexion réussie !");
                console.log("Token récupéré :", token);
                navigation.navigate('MyAccount');
 /*               AsyncStorage.getItem("token")
                    .then(storedToken => {
                        console.log("Token récupéré depuis AsyncStorage dans handleLogin :", storedToken);
                    })
                    .catch(error => {
                        console.error("Erreur lors de la récupération du token depuis AsyncStorage dans handleLogin :", error);
                    });
   */         })
            .catch(error => {
                setErrorMessage("Email ou mot de passe incorrect");
                console.error(error);
            });
    };

    const handleRegister = () => {
        if (!firstname || !lastname || !email || !password) {
            setErrorMessage("Veuillez remplir tous les champs");
            return;
        }
        if (password.length < 8) {
            setErrorMessage("Le mot de passe doit contenir au moins 8 caractères");
            return;
        }
        instance.post('users/register', { firstname, lastname, email, password })
            .then(response => {
                setSuccessMessage("Enregistrement réussi !");
                const token = response.data.token;
                authContext.setToken(token);
                navigation.navigate('MyAccount');
            })
            .catch(error => {
                setErrorMessage("Cette adresse email existe déjà");
                console.error(error);
            });
    };

    const handleGoogleLogin = async () => {
        try {
            // Google login logic
        } catch (error) {
            setErrorMessage("Une erreur s'est produite lors de la connexion via Google");
            console.error(error);
        }
    };

    const handleFacebookLogin = async () => {
        try {
            // Facebook login logic
        } catch (error) {
            setErrorMessage("Une erreur s'est produite lors de la connexion via Facebook");
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            {errorMessage !== '' && <Text style={styles.errorMessage}>{errorMessage}</Text>}
            {successMessage !== '' && <Text style={styles.successMessage}>{successMessage}</Text>}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, selectedButton === 'login' && styles.selectedButton]}
                    onPress={() => handleButtonPress('login')}
                >
                    <Text style={[styles.buttonText, selectedButton === 'login' && styles.selectedButtonText]}>J'ai un compte</Text>
                    <MaterialIcons name="person" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, selectedButton === 'register' && styles.selectedButton]}
                    onPress={() => handleButtonPress('register')}
                >
                    <Text style={[styles.buttonText, selectedButton === 'register' && styles.selectedButtonText]}>Je m'enregistre</Text>
                    <MaterialIcons name="person-add" size={24} color="black" />
                </TouchableOpacity>
            </View>
            {selectedButton === 'login' && (
                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        onChangeText={setEmail}
                        value={email}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Mot de passe"
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry={true}
                    />
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleLogin}
                    >
                        <Text style={styles.submitButtonText}>Se connecter</Text>
                    </TouchableOpacity>
                </View>
            )}
            {selectedButton === 'register' && (
                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Prénom"
                        onChangeText={setFirstname}
                        value={firstname}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Nom"
                        onChangeText={setLastname}
                        value={lastname}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        onChangeText={setEmail}
                        value={email}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Mot de passe"
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry={true}
                    />
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleRegister}
                    >
                        <Text style={styles.submitButtonText}>S'enregistrer</Text>
                    </TouchableOpacity>
                </View>
            )}
            <View style={styles.externalLoginContainer}>
                <TouchableOpacity
                    style={[styles.externalLoginButton, { justifyContent: 'center' }]}
                    onPress={handleGoogleLogin}
                >
                    <Text style={styles.externalLoginButtonText}>Se connecter via Google</Text>
                    <AntDesign name="google" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.externalLoginButton, { justifyContent: 'center' }]}
                    onPress={handleFacebookLogin}
                >
                    <Text style={styles.externalLoginButtonText}>Se connecter via Facebook</Text>
                    <AntDesign name="facebook-square" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

function LoginStack() {
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: {
                backgroundColor: '#D27E00',
            },
            headerTintColor: 'white',
        }}>
            <Stack.Screen name="Welcome" component={LoginPage} options={{ headerShown: false }} />
            <Stack.Screen name={"MyAccount"} component={MyAccount} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default LoginStack;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 50,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        marginTop: 24,
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: '#D27E00',
        fontSize: 18,
        fontWeight: 'bold',
    },
    selectedButtonText: {
        color: 'white',
        marginRight: 8,
    },
    selectedButton: {
        backgroundColor: '#D27E00',
    },
    formContainer: {
        width: '100%',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: '#D27E00',
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    externalLoginContainer: {
        marginTop: 20,
    },
    externalLoginButton: {
        backgroundColor: '#3b5998',
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        width: 250,
        alignItems: 'center',
        flexDirection: 'row',
    },
    externalLoginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    errorMessage: {
        color: 'red',
        marginBottom: 10,
    },
    successMessage: {
        color: 'green',
        marginBottom: 10,
    },
});
