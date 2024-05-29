import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import styles from '../styles/GroupListsStyles';

const GroupLists = ({
                        selectedPage,
                        loading,
                        members,
                        expenses,
                        balances,
                        refunds,
                        handleDebt,
                        handleBalancePress,
                        setShowAddExpenseModal,
                    }) => {
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
                                <View style={styles.expenseUserContainer}>
                                    <Text style={styles.expenseUser}>{expense.idUser.firstname} {expense.idUser.lastname.charAt(0)}.</Text>
                                    {expense.idUser.avatar && (
                                        <Image
                                            source={{ uri: expense.idUser.avatar }}
                                            style={styles.avatar}
                                        />
                                    )}
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                );
            case 'Remboursement':
                return loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <ScrollView contentContainerStyle={styles.refundList}>
                        {refunds.map(refund => refund.idUser !== null && refund.amount > 0 && refund.refunderId._id === (
                            <View key={refund._id} style={styles.refundCard}>
                                <View style={styles.refundDetails}>
                                    <Text style={styles.refundName}>{refund.refunderId.email}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.refundDescription}>{"doit  "}</Text>
                                        <Text style={styles.refundAmount}>{refund.amount} €</Text>
                                        <Text style={styles.refundDescription}>{" à "}</Text>
                                    </View>
                                    <Text style={styles.refundDescription}>{refund.receiverId.email}</Text>
                                </View>
                                <TouchableOpacity onPress={() => handleDebt(refund)}>
                                    <Text style={styles.handleDebtButtonText}>Payer la dette</Text>
                                </TouchableOpacity>
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
                                {balance.idUser.avatar && (
                                    <Image
                                        source={{ uri: balance.idUser.avatar }}
                                        style={styles.avatar}
                                    />
                                )}
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
                                {member.avatar && (
                                    <Image
                                        source={{ uri: member.avatar }}
                                        style={styles.avatar}
                                    />
                                )}
                            </View>
                        ))}
                    </ScrollView>
                );
            default:
                return null;
        }
    };

    return <>{renderContent()}</>;
};

export default GroupLists;
