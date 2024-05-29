import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import instance from '../api/ApiConfig';
import styles from '../styles/ModalStyles';

const GroupModals = ({
                         showAddMemberModal,
                         setShowAddMemberModal,
                         showAddExpenseModal,
                         setShowAddExpenseModal,
                         showBalanceModal,
                         setShowBalanceModal,
                         showLeaveGroupModal,
                         setShowLeaveGroupModal,
                         showExportModal,
                         setShowExportModal,
                         groupId,
                         selectedUserIban,
                         fetchGroupData,
                         loading,
                         setLoading,
                         confirmLeaveGroup,
                         exportExpensesRefund
                     }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [justification, setJustification] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [expenseData, setExpenseData] = useState([]);
    const [currentEmail, setCurrentEmail] = useState('');
    const [currentPercentage, setCurrentPercentage] = useState('');

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
            } else {
                setErrorMessage('Aucun utilisateur trouvé avec cet email');
            }
        } catch (error) {
            setErrorMessage('Aucun utilisateur trouvé avec cet email');
        } finally {
            setLoading(false);
        }
    };

    const handleAddExpenseField = async () => {
        if (!currentEmail || !currentPercentage) {
            Alert.alert('Erreur', 'Email et Pourcentage sont obligatoires.');
            return;
        }

        const token = await AsyncStorage.getItem('token');
        const userResponse = await instance.get(`/users/email/${currentEmail}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (userResponse.data) {
            setExpenseData([...expenseData, { email: currentEmail, percentage: currentPercentage }]);
            setCurrentEmail('');
            setCurrentPercentage('');
        } else {
            setErrorMessage('Aucun utilisateur trouvé avec cet email');
        }
    };

    const handleRemoveExpenseField = (index) => {
        const newExpenseData = [...expenseData];
        newExpenseData.splice(index, 1);
        setExpenseData(newExpenseData);
    };

    const addExpense = async () => {
        if (!name || !amount || expenseData.length === 0) {
            Alert.alert('Erreur', 'Nom, Montant, et au moins un Email et Pourcentage sont obligatoires.');
            return;
        }

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const token = await AsyncStorage.getItem('token');
            const storedUserData = await AsyncStorage.getItem('userData');
            if (storedUserData) {
                const userData = JSON.parse(storedUserData);
                const userId = userData._id;

                await instance.post(`/expenses/`, {
                    idGroup: groupId,
                    idUser: userId,
                    name: name,
                    description: description,
                    amount: Number(amount),
                    date: new Date().toString(),
                    justification: justification,
                    category: category,
                    expenseData: expenseData
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                for (const expense of expenseData) {
                    const refunder = await instance.get(`/users/email/${expense.email}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (refunder.data) {
                        await instance.put(`/debts/${groupId}`, {
                            receiverId: userId,
                            refunderId: refunder.data._id,
                            idGroup: groupId,
                            amount: Number(amount) * (Number(expense.percentage) / 100),
                        }, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            }
                        });
                    }
                }

                setSuccessMessage('Dépense ajoutée avec succès');
                setName('');
                setDescription('');
                setAmount('');
                setCategory('');
                setJustification('');
                setExpenseData([]);
                await fetchGroupData();
            } else {
                setErrorMessage('Erreur: Utilisateur non trouvé');
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout de la dépense:", error);
            setErrorMessage("Erreur lors de l'ajout de la dépense");
        } finally {
            setLoading(false);
            setShowAddExpenseModal(false);
        }
    };

    return (
        <>
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

            <Modal
                visible={showAddExpenseModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowAddExpenseModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Ajouter une dépense</Text>
                        <View style={styles.expenseForm}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nom"
                                value={name}
                                onChangeText={setName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Description"
                                value={description}
                                onChangeText={setDescription}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Montant"
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Catégorie"
                                value={category}
                                onChangeText={setCategory}
                            />
                        </View>
                        <View style={styles.expenseContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={currentEmail}
                                onChangeText={setCurrentEmail}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Pourcentage"
                                value={currentPercentage}
                                keyboardType="numeric"
                                onChangeText={setCurrentPercentage}
                            />
                            <TouchableOpacity style={styles.addButton} onPress={handleAddExpenseField}>
                                <Text style={styles.addButtonText}>Ajouter</Text>
                            </TouchableOpacity>
                        </View>
                        {expenseData.map((expense, index) => (
                            <View key={index} style={styles.expenseItem}>
                                <Text style={styles.expenseText}>{expense.email} - {expense.percentage}%</Text>
                                <TouchableOpacity onPress={() => handleRemoveExpenseField(index)}>
                                    <Ionicons name="close" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TextInput
                            style={styles.input}
                            placeholder="Justification"
                            value={justification}
                            onChangeText={setJustification}
                        />
                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <>
                                <TouchableOpacity style={styles.submitButton} onPress={addExpense}>
                                    <Text style={styles.submitButtonText}>Ajouter</Text>
                                </TouchableOpacity>
                                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                                {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
                                <TouchableOpacity style={styles.closeButton} onPress={() => setShowAddExpenseModal(false)}>
                                    <Text style={styles.closeButtonText}>Fermer</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showBalanceModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowBalanceModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>IBAN de l'utilisateur</Text>
                        <Text>{selectedUserIban}</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowBalanceModal(false)}>
                            <Text style={styles.closeButtonText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showLeaveGroupModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowLeaveGroupModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Êtes-vous sûr de vouloir quitter le groupe ?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.confirmButton} onPress={confirmLeaveGroup}>
                                <Text style={styles.confirmButtonText}>Oui</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowLeaveGroupModal(false)}>
                                <Text style={styles.cancelButtonText}>Non</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showExportModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowExportModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Exporter les dépenses</Text>
                        <TouchableOpacity style={styles.submitButton} onPress={() => exportExpensesRefund('pdf')}>
                            <Text style={styles.submitButtonText}>Exporter en PDF</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.submitButton} onPress={() => exportExpensesRefund('csv')}>
                            <Text style={styles.submitButtonText}>Exporter en CSV</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowExportModal(false)}>
                            <Text style={styles.closeButtonText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default GroupModals;
