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
            console.log(groupIds)
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
        } catch (error) {
            console.error("Erreur lors de la récupération des dépenses de l'utilisateur :", error);
        } finally {
            setLoading(false);
        }
    };

    const getLineChartData = () => {
        const labels = [];
        const data = [];

        expenses.forEach(expense => {
            labels.push(moment(expense.date).format('YYYY-MM-DD'));
            data.push(expense.amount);
        });

        labels.reverse();
        data.reverse();

        return {
            labels,
            datasets: [
                {
                    data,
                    strokeWidth: 2,
                    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Couleur de la ligne en bleu
                }
            ]
        };
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
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
        }));
    };

    const chartConfig = {
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
        }
    };

    const screenWidth = Dimensions.get('window').width;
    const chartWidth = screenWidth - 40 + expenses.length * 50; // Ajustement de la largeur pour espacer les points

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Vos 10 dernières dépenses</Text>
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
                            width={chartWidth}
                            height={220}
                            chartConfig={chartConfig}
                            bezier
                            style={styles.chart}
                        />
                    </ScrollView>
                    <Text style={styles.title}>Répartition des dépenses par groupe</Text>
                    <PieChart
                        data={getPieChartData()}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={chartConfig}
                        accessor="amount"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                        style={styles.chart}
                    />
                </>
            )}
        </ScrollView>
    );
}

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
        paddingRight: 30, // Ajout de padding à droite pour espacer les points
        paddingLeft: 30,  // Ajout de padding à gauche pour espacer les points
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
