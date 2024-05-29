import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Modal, Alert } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import GroupLists from './GroupLists';
import GroupModals from '../modals/GroupModals';
import styles from '../styles/MyGroupStyles';
import instance from '../api/ApiConfig';
import base64 from 'base-64';

export default function MyGroup({ route }) {
    const { groupId } = route.params;
    const [selectedPage, setSelectedPage] = useState('Dépenses');
    const [groupData, setGroupData] = useState(null);
    const [members, setMembers] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [balances, setBalances] = useState([]);
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [showLeaveGroupModal, setShowLeaveGroupModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [selectedUserIban, setSelectedUserIban] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        fetchGroupData();
    }, []);

    useEffect(() => {
        if (groupData) {
            navigation.setOptions({
                title: truncateGroupName(groupData.name),
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
                                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('GroupStatsScreen', { groupId })}>
                                    <Text style={styles.optionButtonText}>Afficher stats</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.optionButton} onPress={() => setShowExportModal(true)}>
                                    <Text style={styles.optionButtonText}>Exporter les dépenses</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.optionButton} onPress={handleLeaveGroupPress}>
                                    <Text style={styles.optionButtonText}>Quitter le groupe</Text>
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
        } else if (selectedPage === 'Remboursement') {
            fetchRefunds();
        }
    }, [selectedPage]);

    const truncateGroupName = (name, maxLength = 20) => {
        return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
    };

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
                const memberPromises = groupData.members.map(member => {
                    const memberId = member._id;

                    return instance.get(`/users/${memberId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                });
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

    const fetchRefunds = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await instance.get(`/debts/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRefunds(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des remboursements :", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLeaveGroupPress = () => {
        setShowLeaveGroupModal(true);
    };

    const confirmLeaveGroup = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const storedUserData = await AsyncStorage.getItem('userData');
            if (storedUserData) {
                const userData = JSON.parse(storedUserData);
                const userId = userData._id;
                await instance.put(`/groups/${groupId}/removeUser`, { idUser: userId }, { headers: { Authorization: `Bearer ${token}` } });
                navigation.goBack();
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur du groupe :", error);
        } finally {
            setLoading(false);
            setShowLeaveGroupModal(false);
        }
    };

    const handleDebt = async (refund) => {
        if (!refund || !refund.refunderId || !refund.receiverId) {
            console.error("Invalid refund object:", refund);
            return;
        }

        const newDebt = { refunderId: refund.refunderId._id, amount: -refund.amount };
        const newRefund = {
            payerId: refund.receiverId._id,
            refunderId: refund.refunderId._id,
            idGroup: groupId,
            amount: refund.amount,
            date: new Date()
        };
        const token = await AsyncStorage.getItem('token');

        try {
            await instance.put(`debts/${groupId}`, newDebt, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            await instance.post(`refunds/`, newRefund, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            await fetchRefunds();
        } catch (error) {
            console.error("Error handling debt:", error);
        }
    };

    const exportExpensesRefund = async (format) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await instance.get(`groups/export/${groupId}?format=${format}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'arraybuffer'
            });

            const base64Data = base64.encode(response.data);
            const fileUri = `${FileSystem.documentDirectory}expenses.${format}`;
            await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });

            Alert.alert('Exportation réussie', `Le fichier a été exporté en tant que expenses.${format}`);
        } catch (error) {
            console.error("échec de l'export", error);
            Alert.alert('Erreur', "échec de l'export");
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
            <GroupLists
                selectedPage={selectedPage}
                loading={loading}
                members={members}
                expenses={expenses}
                balances={balances}
                refunds={refunds}
                handleDebt={handleDebt}
                handleBalancePress={(user) => {
                    setSelectedUserIban(user.iban || 'IBAN non spécifié');
                    setShowBalanceModal(true);
                }}
                setShowAddExpenseModal={setShowAddExpenseModal}
            />
            <TouchableOpacity style={styles.floatingButton} onPress={() => setShowAddMemberModal(true)}>
                <AntDesign name="adduser" size={24} color="white" />
            </TouchableOpacity>

            <GroupModals
                showAddMemberModal={showAddMemberModal}
                setShowAddMemberModal={setShowAddMemberModal}
                showAddExpenseModal={showAddExpenseModal}
                setShowAddExpenseModal={setShowAddExpenseModal}
                showBalanceModal={showBalanceModal}
                setShowBalanceModal={setShowBalanceModal}
                showLeaveGroupModal={showLeaveGroupModal}
                setShowLeaveGroupModal={setShowLeaveGroupModal}
                showExportModal={showExportModal}
                setShowExportModal={setShowExportModal}
                groupId={groupId}
                selectedUserIban={selectedUserIban}
                fetchGroupData={fetchGroupData}
                loading={loading}
                setLoading={setLoading}
                confirmLeaveGroup={confirmLeaveGroup}
                exportExpensesRefund={exportExpensesRefund}
            />
        </View>
    );
}
