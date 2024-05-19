import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Modal } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, AntDesign } from '@expo/vector-icons';
import instance from '../api/ApiConfig';

export default function MyGroup({ route, navigation }) {
    const { groupId } = route.params;
    const [selectedPage, setSelectedPage] = useState('Dépenses');
    const [groupData, setGroupData] = useState(null);
    const [members, setMembers] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [balances, setBalances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [justification, setJustification] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [selectedUserIban, setSelectedUserIban] = useState('');

    useEffect(() => {
        fetchGroupData();
    }, []);

    useEffect(() => {
        if (groupData) {
            navigation.setOptions({
                title: groupData.name,
                headerRight: () => (
                    <View>
                        <TouchableOpacity onPress={() => setShowOptions(!showOptions)} style={{ marginRight: 10 }}>
                            <Ionicons name={showOptions ? "close" : "menu"} size={24} color="black" />
                        </TouchableOpacity>
                        {showOptions && (
                            <View style={styles.optionsContainer}>
                                <TouchableOpacity style={styles.optionButton} onPress={() => setSelectedPage('Membres')}>
                                    <Text style={styles.optionButtonText}>Voir Membres</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.optionButton} onPress={leaveGroup}>
                                    <Text style={styles.optionButtonText}>Quitter le groupe</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('GroupStatsScreen', { groupId })}>
                                    <Text style={styles.optionButtonText}>Afficher stats</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ),
            });
        }
    }, [groupData, showOptions]);

    useEffect(() => {
        if (selectedPage === 'Membres') {
            fetchMembers();
        } else if (selectedPage === 'Dépenses') {
            fetchExpenses();
        } else if (selectedPage === 'Solde') {
            fetchBalances();
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

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await instance.get(`/expenses/group/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const sortedExpenses = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setExpenses(sortedExpenses);
        } catch (error) {
            console.error("Erreur lors de la récupération des dépenses :", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBalances = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await instance.get(`/balances/group/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBalances(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des soldes :", error);
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

    const addExpense = async () => {
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
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                setSuccessMessage('Dépense ajoutée avec succès');
                setName('');
                setDescription('');
                setAmount('');
                setCategory('');
                setJustification('');
                await fetchExpenses();
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
    const handleBalancePress = (user) => {
        setSelectedUserIban(user.iban || 'IBAN non spécifié');
        setShowBalanceModal(true);
    };
    const renderContent = () => {
        switch (selectedPage) {
            case 'Dépenses':
                return loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <ScrollView contentContainerStyle={styles.expenseList}>
                        <TouchableOpacity style={styles.addExpenseButton} onPress={() => setShowAddExpenseModal(true)}>
                            <Text style={styles.addExpenseButtonText}>Ajouter une dépense</Text>
                        </TouchableOpacity>
                        {expenses.map(expense => expense.idUser !== null && (
                            <View key={expense._id} style={styles.expenseCard}>
                                <View style={styles.expenseDetails}>
                                    <Text style={styles.expenseName}>{expense.name}</Text>
                                    <Text style={styles.expenseDescription}>{expense.description}</Text>
                                    <Text style={styles.expenseAmount}>{expense.amount} €</Text>
                                    <Text style={styles.expenseCategory}>{expense.category}</Text>
                                    <Text style={styles.expenseDate}>{new Date(expense.date).toLocaleDateString()}</Text>
                                </View>
                                <Text style={styles.expenseUser}>{expense.idUser.firstname} {expense.idUser.lastname.charAt(0)}.</Text>
                            </View>
                        ))}
                    </ScrollView>
                );
            case 'Remboursement':
                return <Text style={styles.pageText}>Page Remboursement</Text>;
            case 'Solde':
                return loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <ScrollView contentContainerStyle={styles.balanceList}>
                        {balances.map(balance => balance.idUser !== null && (
                            <TouchableOpacity
                                key={balance._id}
                                style={styles.balanceCard}
                                onPress={() => handleBalancePress(balance.idUser)}
                            >
                                <View style={styles.balanceDetails}>
                                    <Text style={styles.balanceName}>{balance.idUser.firstname} {balance.idUser.lastname.charAt(0)}.</Text>
                                    <Text style={styles.balanceAmount}>-{balance.balance} €</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                );
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
                <TouchableOpacity
                    style={[styles.pageButton, selectedPage === 'Dépenses' && styles.selectedPageButton]}
                    onPress={() => setSelectedPage('Dépenses')}
                >
                    <Text style={styles.pageButtonText}>Dépenses</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.pageButton, selectedPage === 'Remboursement' && styles.selectedPageButton]}
                    onPress={() => setSelectedPage('Remboursement')}
                >
                    <Text style={styles.pageButtonText}>Remboursement</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.pageButton, selectedPage === 'Solde' && styles.selectedPageButton]}
                    onPress={() => setSelectedPage('Solde')}
                >
                    <Text style={styles.pageButtonText}>Solde</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                {renderContent()}
            </View>
            <TouchableOpacity style={styles.floatingButton} onPress={() => setShowAddMemberModal(true)}>
                <AntDesign name="adduser" size={24} color="white" />
            </TouchableOpacity>

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
    pageButton: {
        backgroundColor: '#D27E00',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    selectedPageButton: {
        backgroundColor: '#C06D00',
    },
    pageButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
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
        padding: '5%',
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
    optionsContainer: {
        position: 'absolute',
        top: 40,
        right: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 10,
    },
    optionButton: {
        padding: 10,
    },
    optionButtonText: {
        fontSize: 16,
        color: 'black',
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
    expenseList: {
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 60,
    },
    expenseCard: {
        width: '95%',
        padding: '5%',
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    expenseDetails: {
        flex: 1,
    },
    expenseName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    expenseDescription: {
        fontSize: 16,
    },
    expenseAmount: {
        fontSize: 16,
        color: 'green',
    },
    expenseCategory: {
        fontSize: 16,
        color: 'blue',
    },
    expenseJustification: {
        fontSize: 16,
        color: 'purple',
    },
    expenseDate: {
        fontSize: 14,
        color: 'gray',
    },
    expenseUser: {
        fontSize: 16,
        color: 'black',
        marginLeft: 10,
    },
    addExpenseButton: {
        width: '100%',
        padding: '5%',
        borderRadius: 10,
        backgroundColor: '#D27E00',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginVertical: 10,
        alignItems: 'center',
    },
    addExpenseButtonText: {
        fontSize: 18,
        color: 'white',
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
        backgroundColor: '#D27E00',
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
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    successText: {
        color: 'green',
        marginBottom: 10,
    },
    balanceList: {
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 60,
    },
    balanceCard: {
        width: '95%',
        padding: '5%',
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
    balanceDetails: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    balanceName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 10,
    },
    balanceAmount: {
        fontSize: 18,
        color: 'red',
    },
});
