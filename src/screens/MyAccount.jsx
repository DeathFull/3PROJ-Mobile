import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import instance from '../api/ApiConfig';
import { checkLoggedIn } from '../components/checkLoggedIn';
import { useFocusEffect } from '@react-navigation/native';

export default function MyAccount({ navigation }) {
    const [showIbanModal, setShowIbanModal] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [iban, setIban] = useState('');
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [groups, setGroups] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const initializeUserData = async () => {
        const { isLoggedIn, userData } = await checkLoggedIn();
        if (isLoggedIn) {
            setUserData(userData);
            fetchGroups();
        }
    };

    useEffect(() => {
        initializeUserData();
    }, []);

    useFocusEffect(
        useCallback(() => {
            initializeUserData();
        }, [])
    );

    const fetchGroups = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await instance.get('/users/groups', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("reponses des groupes", response.data);
            setGroups(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des groupes :", error);
        }
    };

    const toggleIbanModal = () => {
        setShowIbanModal(!showIbanModal);
        setErrorMessage('');
    };

    const toggleGroupModal = () => {
        setShowGroupModal(!showGroupModal);
    };

    const toggleOptionsModal = () => {
        setShowOptionsModal(!showOptionsModal);
    };

    const updateIban = async () => {
        if (iban.length < 14) {
            setErrorMessage("L'IBAN doit comporter au moins 14 caractères.");
            return;
        } else if (iban.length > 34) {
            setErrorMessage("L'IBAN ne peut pas comporter plus de 34 caractères.");
            return;
        }

        if (userData && userData._id) {
            setLoading(true);
            try {
                const response = await instance.put(`/users/${userData._id}`, { iban });
                const updatedUserData = { ...userData, iban };
                setUserData(updatedUserData);
                await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
                setSuccessMessage("IBAN mis à jour avec succès !");
            } catch (error) {
                setErrorMessage("Erreur lors de la mise à jour de l'IBAN");
                console.error("Erreur lors de la mise à jour de l'IBAN :", error);
            } finally {
                setLoading(false);
            }
        } else {
            setErrorMessage("Utilisateur non identifié");
        }
    };

    const createGroup = async () => {
        if (!groupName || !groupDescription) {
            setErrorMessage("Tous les champs sont obligatoires.");
            return;
        }

        const userId = userData._id;
        const token = await AsyncStorage.getItem('token');
        const members = [userId];

        try {
            const response = await instance.post("/groups",
                { name: groupName, members, description: groupDescription, userId },
                { headers: { Authorization: `Bearer ${token}` } });

            console.log("Groupe créé", response.data);
            setSuccessMessage("Groupe créé avec succès !");
            fetchGroups();
            toggleGroupModal();
        } catch (error) {
            setErrorMessage("Erreur lors de la création du groupe");
            console.error("Erreur:", error);
        }
    };

    const handleGroupPress = (groupId) => {
        navigation.navigate('MyGroup', { groupId });
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeText}>Bienvenue</Text>
                    {userData && (
                        <Text style={styles.userDataText}>{userData.firstname} !</Text>
                    )}
                </View>

                {userData && userData.iban ? (
                    <View style={styles.cardContainer}>
                        <View style={styles.card}>
                            <Text style={styles.ibanText}>IBAN: {userData.iban}</Text>
                        </View>
                        <TouchableOpacity style={styles.editButton} onPress={toggleIbanModal}>
                            <Text style={styles.editButtonText}>Modifier</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.ibanSectionContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>Vous pouvez déposer votre IBAN ici</Text>
                        </View>
                        <View style={styles.newButtonContainer}>
                            <TouchableOpacity style={styles.newButton} onPress={toggleIbanModal}>
                                <Text style={styles.buttonText}>Nouveau Bouton</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <Text style={styles.groupText}>Mes groupes</Text>
                {groups.map((group) => (
                    <TouchableOpacity key={group._id} style={styles.cardContainer} onPress={() => handleGroupPress(group._id)}>
                        <View style={styles.card}>
                            <View style={styles.groupDetails}>
                                <Text style={styles.groupTitle}>{group.name}</Text>
                                <Text>{group.description}</Text>
                            </View>
                            <View style={styles.groupInfoContainer}>
                                <Text style={styles.memberCount}>{group.members.length}</Text>
                                <FontAwesome name="group" size={24} color="black" />
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TouchableOpacity style={styles.button} onPress={toggleOptionsModal}>
                <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>

            <Modal
                visible={showIbanModal}
                transparent={true}
                animationType="slide"
                onRequestClose={toggleIbanModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Entrer les informations de l'IBAN</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="IBAN"
                            value={iban}
                            onChangeText={setIban}
                        />
                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <>
                                <TouchableOpacity style={styles.submitButton} onPress={() => {
                                    updateIban();
                                    toggleIbanModal();
                                }}>
                                    <Text style={styles.submitButtonText}>Soumettre</Text>
                                </TouchableOpacity>
                                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                                {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
                            </>
                        )}
                        <TouchableOpacity style={styles.closeButton} onPress={toggleIbanModal}>
                            <Text style={styles.closeButtonText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showOptionsModal}
                transparent={true}
                animationType="slide"
                onRequestClose={toggleOptionsModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => { toggleOptionsModal(); toggleGroupModal(); }}>
                            <Text style={styles.menuItemText}>Créer un groupe</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={toggleOptionsModal}>
                            <Text style={styles.menuItemText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showGroupModal}
                transparent={true}
                animationType="slide"
                onRequestClose={toggleGroupModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Créer un groupe</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nom du groupe"
                            value={groupName}
                            onChangeText={setGroupName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Description"
                            value={groupDescription}
                            onChangeText={setGroupDescription}
                        />
                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <>
                                <TouchableOpacity style={styles.submitButton} onPress={createGroup}>
                                    <Text style={styles.submitButtonText}>Soumettre</Text>
                                </TouchableOpacity>
                                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                                {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
                            </>
                        )}
                        <TouchableOpacity style={styles.closeButton} onPress={toggleGroupModal}>
                            <Text style={styles.closeButtonText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 60,
    },
    cardContainer: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 10,
    },
    card: {
        width: '90%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flexDirection: 'row', // Ajout de flexDirection pour aligner les enfants horizontalement
        justifyContent: 'space-between', // Ajout de justifyContent pour espacer les éléments
    },
    ibanText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    groupInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    memberCount: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 5,
    },
    groupDetails: {
        flex: 1,
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    welcomeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 5,
    },
    userDataText: {
        fontSize: 20,
    },
    ibanSectionContainer: {
        width: '100%',
        alignItems: 'center',
    },
    titleContainer: {
        marginTop: 100,
        alignItems: 'center',
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    newButtonContainer: {
        marginTop: 30,
        width: '100%',
        alignItems: 'center',
    },
    newButton: {
        width: '70%',
        height: 100,
        backgroundColor: '#ccc',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 20,
        color: 'black',
    },
    groupText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 10,
        textAlign: 'center',
    },
    button: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        backgroundColor: '#D27E00',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButton: {
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    editButtonText: {
        color: 'white',
        fontSize: 14,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
    },
    closeButton: {
        padding: 10,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        color: '#007bff',
        fontSize: 16,
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    menuItemText: {
        fontSize: 18,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    successText: {
        color: 'green',
        marginBottom: 10,
    },
});
