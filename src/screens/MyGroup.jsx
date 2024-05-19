import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, AntDesign } from '@expo/vector-icons';
import instance from '../api/ApiConfig';
import GroupLists from '../components/GroupLists';
import GroupModals from '../modals/GroupModals';
import styles from '../styles/MyGroupStyles';

export default function MyGroup({ route, navigation }) {
    const { groupId } = route.params;
    const [selectedPage, setSelectedPage] = useState('Dépenses');
    const [groupData, setGroupData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [showLeaveGroupModal, setShowLeaveGroupModal] = useState(false);
    const [selectedUserIban, setSelectedUserIban] = useState('');

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
                groupData={groupData}
                groupId={groupId}
                setLoading={setLoading}
                setShowAddExpenseModal={setShowAddExpenseModal}
                setShowBalanceModal={setShowBalanceModal}
                setSelectedUserIban={setSelectedUserIban}
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
                groupId={groupId}
                selectedUserIban={selectedUserIban}
                fetchGroupData={fetchGroupData}
                loading={loading}
                setLoading={setLoading}
                confirmLeaveGroup={confirmLeaveGroup}
            />
        </View>
    );
}
