import React from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import instance from '../api/ApiConfig';
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from '../styles/GroupListsStyles';

const GroupLists = ({
                        selectedPage,
                        loading,
                        groupData,
                        groupId,
                        setLoading,
                        setShowAddExpenseModal,
                        setShowBalanceModal,
                        setSelectedUserIban
                    }) => {
    const [members, setMembers] = React.useState([]);
    const [expenses, setExpenses] = React.useState([]);
    const [balances, setBalances] = React.useState([]);

    React.useEffect(() => {
        if (selectedPage === 'Membres') {
            fetchMembers();
        } else if (selectedPage === 'Dépenses') {
            fetchExpenses();
        } else if (selectedPage === 'Solde') {
            fetchBalances();
        }
    }, [selectedPage]);

    const fetchMembers = async () => {
        setLoading(true);
        try {
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
        <View style={styles.content}>
            {renderContent()}
        </View>
    );
};

export default GroupLists;
