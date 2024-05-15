import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Modal } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import instance from '../api/ApiConfig';

export default function MyGroup({ route, navigation }) {
    const { groupId } = route.params;
    const [selectedPage, setSelectedPage] = useState('Dépenses');
    const [groupData, setGroupData] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showChoiceModal, setShowChoiceModal] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchGroupData();
    }, []);

    useEffect(() => {
        if (selectedPage === 'Membres') {
            fetchMembers();
        }
    }, [selectedPage]);

    const fetchGroupData = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await instance.get(`/groups/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setGroupData(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des données du groupe :", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async () => {
        setLoading(true);
        try {
            if (groupData && groupData.members) {
                const token = await AsyncStorage.getItem('token');
                const memberPromises = groupData.members.map(memberId =>
                    instance.get(`/users/${memberId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                );
                const memberResponses = await Promise.all(memberPromises);
                setMembers(memberResponses.map(res => res.data));
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des membres :", error);
        } finally {
            setLoading(false);
        }
    };

    const addMember = async () => {
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const token = await AsyncStorage.getItem('token');
            const userResponse = await instance.get(`/users/email/${email}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (userResponse.data) {
                const userId = userResponse.data._id;
                await instance.put(`/groups/${groupId}/addUser`,
                    { idUser: userId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSuccessMessage('Utilisateur ajouté avec succès');
                setEmail('');
                await fetchGroupData();
                await fetchMembers();
            } else {
                setErrorMessage('Aucun utilisateur trouvé avec cet email');
            }
        } catch (error) {
            setErrorMessage('Aucun utilisateur trouvé avec cet email');
        } finally {
            setLoading(false);
        }
    };

    const leaveGroup = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const token = await AsyncStorage.getItem('token');
            const storedUserData = await AsyncStorage.getItem('userData');
            if (storedUserData) {
                const userData = JSON.parse(storedUserData);
                const userId = userData._id;
                console.log(userData._id);
                await instance.put(`/groups/${groupId}/removeUser`,
                    { idUser: userId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                navigation.goBack();
            } else {
                setErrorMessage('Erreur: Utilisateur non trouvé');
            }
        } catch (error) {
            setErrorMessage('Erreur: Utilisateur non trouvé');
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        switch (selectedPage) {
            case 'Dépenses':
                return <Text style={styles.pageText}>Page Dépenses</Text>;
            case 'Remboursement':
                return <Text style={styles.pageText}>Page Remboursement</Text>;
            case 'Membres':
                return loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <ScrollView contentContainerStyle={styles.memberList}>
                        {members.map(member => (
                            <View key={member._id} style={styles.memberCard}>
                                <Text style={styles.memberName}>{member.firstname} {member.lastname}</Text>
                                <Text>{member.email}</Text>
                            </View>
                        ))}
                    </ScrollView>
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button title="Dépenses" onPress={() => setSelectedPage('Dépenses')} />
                <Button title="Remboursement" onPress={() => setSelectedPage('Remboursement')} />
                <Button title="Membres" onPress={() => setSelectedPage('Membres')} />
            </View>
            <View style={styles.content}>
                {renderContent()}
            </View>
            <TouchableOpacity style={styles.floatingButton} onPress={() => setShowChoiceModal(true)}>
                <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>

            {/* Choice Modal */}
            <Modal
                visible={showChoiceModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowChoiceModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.modalButton} onPress={() => { setShowChoiceModal(false); setShowAddMemberModal(true); }}>
                            <Text style={styles.modalButtonText}>Ajouter un utilisateur</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={leaveGroup}>
                            <Text style={styles.modalButtonText}>Quitter le groupe</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowChoiceModal(false)}>
                            <Text style={styles.closeButtonText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Add Member Modal */}
            <Modal
                visible={showAddMemberModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowAddMemberModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Ajouter un utilisateur</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Adresse email"
                            value={email}
                            onChangeText={setEmail}
                        />
                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <>
                                <TouchableOpacity style={styles.submitButton} onPress={addMember}>
                                    <Text style={styles.submitButtonText}>Ajouter</Text>
                                </TouchableOpacity>
                                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                                {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
                                <TouchableOpacity style={styles.closeButton} onPress={() => setShowAddMemberModal(false)}>
                                    <Text style={styles.closeButtonText}>Fermer</Text>
                                </TouchableOpacity>
                            </>
                        )}
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageText: {
        fontSize: 20,
    },
    memberList: {
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 60,
    },
    memberCard: {
        width: '95%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginVertical: 10,
        alignItems: 'center',
    },
    memberName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    floatingButton: {
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
    modalButton: {
        width: '100%',
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#007bff',
        borderRadius: 5,
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
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
