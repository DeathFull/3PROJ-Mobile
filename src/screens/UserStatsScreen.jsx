import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import AsyncStorage from "@react-native-async-storage/async-storage";
import instance from '../api/ApiConfig';
import moment from 'moment';

export default function UserStatsScreen({ navigation }) {
    const [expenses, setExpenses] = useState([]);
    const [groups, setGroups] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUserExpenses();
    }, []);

    const fetchUserExpenses = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await instance.get('/expenses/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const sortedExpenses = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            const latestExpenses = sortedExpenses.slice(0, 10);
            setExpenses(latestExpenses);

            const groupIds = [...new Set(latestExpenses.map(expense => expense.idGroup))];
            const groupResponses = await Promise.all(groupIds.map(idGroup =>
                instance.get(`/groups/${idGroup}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            ));

            const groups = {};
            groupResponses.forEach(response => {
                groups[response.data._id] = response.data.name;
            });
            setGroups(groups);

            navigation.setOptions({
                title: "User Stats",
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des dépenses de l'utilisateur :", error);
        } finally {
            setLoading(false);
        }
    };

    const generateColor = () => {
        let color;
        do {
            color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        } while (color === '#ffffff' || color === '#fff');
        return color;
    };

    const getPieChartData = () => {
        const groupTotals = expenses.reduce((totals, expense) => {
            const groupName = groups[expense.idGroup] || 'Unknown Group';
            if (!totals[groupName]) {
                totals[groupName] = 0;
            }
            totals[groupName] += expense.amount;
            return totals;
        }, {});

        return Object.keys(groupTotals).map(groupName => ({
            name: groupName,
            amount: groupTotals[groupName],
            color: generateColor(),
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
        }));
    };

    const getLineChartData = () => {
        const labels = expenses.map(expense => moment(expense.date).format('DD/MM'));
        const data = expenses.map(expense => expense.amount);

        return {
            labels,
            datasets: [
                {
                    data,
                    strokeWidth: 2,
                },
            ],
        };
    };

    const screenWidth = Dimensions.get('window').width;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Vos 10 dernières opérations</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : expenses.length === 0 ? (
                <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>Vous n'avez pas encore de dépenses !</Text>
                </View>
            ) : (
                <>
                    <ScrollView horizontal>
                        <LineChart
                            data={getLineChartData()}
                            width={screenWidth * 2}
                            height={220}
                            chartConfig={lineChartConfig}
                            bezier
                            style={styles.chart}
                            renderDotContent={({ x, y, index }) => (
                                <Text key={index} style={{ position: 'absolute', top: y - -2, left: x - -5, fontSize: 10, color: '#0000ff' }}>
                                    {expenses[index].amount}
                                </Text>
                            )}
                        />
                    </ScrollView>
                    <View style={styles.separator} />
                    <Text style={styles.title}>Vos opérations par groupes</Text>
                    <ScrollView horizontal>
                        <PieChart
                            data={getPieChartData()}
                            width={screenWidth * 2}
                            height={220}
                            chartConfig={pieChartConfig}
                            accessor="amount"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            absolute
                            style={styles.chart}
                        />
                    </ScrollView>
                    <View style={styles.legendContainer}>
                        {getPieChartData().map((item, index) => (
                            <View key={index} style={styles.legendItem}>
                                <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                                <Text
                                    style={styles.legendText}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {item.name}
                                </Text>
                            </View>
                        ))}
                    </View>
                </>
            )}
        </ScrollView>
    );
}

const lineChartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#ffffff",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Couleur de la ligne en bleu
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 2, // optional, defaults to 2dp
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
        borderRadius: 16,
    },
    propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#0000ff", // Couleur des points en bleu
    },
};

const pieChartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20, // Ajout de padding en bas pour permettre le défilement complet
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    chart: {
        marginBottom: 20,
    },
    legendContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
        maxWidth: '90%',
    },
    colorBox: {
        width: 15,
        height: 15,
        marginRight: 10,
    },
    legendText: {
        flex: 1,
        fontSize: 14,
        color: '#7F7F7F',
    },
    separator: {
        height: 20, // Espace entre les deux graphiques
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noDataText: {
        fontSize: 18,
        color: '#7F7F7F',
        textAlign: 'center',
    },
});

