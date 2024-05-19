import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import instance from '../api/ApiConfig';
import { checkLoggedIn } from '../components/checkLoggedIn';
import { useFocusEffect } from '@react-navigation/native';
import AccountModals from '../modals/AccountModals';
import styles from '../styles/MyAccountStyles';

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
    const [ibanVisible, setIbanVisible] = useState(false);

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

            setGroups(response.data);
        } catch (error) {
            console.error("Error fetching groups:", error);
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
                const token = await AsyncStorage.getItem('token');
                await instance.put(`/users`, { iban }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const updatedUserData = { ...userData, iban };
                setUserData(updatedUserData);
                await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
                setSuccessMessage("IBAN mis à jour avec succès !");
            } catch (error) {
                setErrorMessage("Erreur lors de la mise à jour de l'IBAN");
                console.error("Error updating IBAN:", error);
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
            await instance.post("/groups",
                { name: groupName, members, description: groupDescription, userId },
                { headers: { Authorization: `Bearer ${token}` } });

            setSuccessMessage("Groupe créé avec succès !");
            fetchGroups();
            toggleGroupModal();
        } catch (error) {
            setErrorMessage("Erreur lors de la création du groupe");
            console.error("Error creating group:", error);
        }
    };

    const handleGroupPress = (groupId) => {
        navigation.navigate('MyGroup', { groupId });
    };

    const toggleIbanVisibility = () => {
        setIbanVisible(!ibanVisible);
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
                            <Text style={styles.ibanText}>
                                IBAN: {ibanVisible ? userData.iban : '**** **** **** ****'}
                            </Text>
                            <TouchableOpacity onPress={toggleIbanVisibility}>
                                <Ionicons name={ibanVisible ? "eye-off" : "eye"} size={24} color="black" />
                            </TouchableOpacity>
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

            <AccountModals
                showIbanModal={showIbanModal}
                setShowIbanModal={setShowIbanModal}
                showGroupModal={showGroupModal}
                setShowGroupModal={setShowGroupModal}
                showOptionsModal={showOptionsModal}
                setShowOptionsModal={setShowOptionsModal}
                iban={iban}
                setIban={setIban}
                groupName={groupName}
                setGroupName={setGroupName}
                groupDescription={groupDescription}
                setGroupDescription={setGroupDescription}
                updateIban={updateIban}
                createGroup={createGroup}
                errorMessage={errorMessage}
                successMessage={successMessage}
                loading={loading}
                toggleIbanModal={toggleIbanModal}
                toggleGroupModal={toggleGroupModal}
                toggleOptionsModal={toggleOptionsModal}
            />
        </View>
    );
}
