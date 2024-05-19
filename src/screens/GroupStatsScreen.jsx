import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import AsyncStorage from "@react-native-async-storage/async-storage";
import instance from '../api/ApiConfig';

export default function GroupStatsScreen({ route, navigation }) {
    const { groupId } = route.params;
    const [balances, setBalances] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBalancesAndGroupData();
    }, []);

    const fetchBalancesAndGroupData = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');

            // Fetch group data
            const groupResponse = await instance.get(`/groups/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const groupData = groupResponse.data;

            // Set the header title with group name
            navigation.setOptions({
                title: `${groupData.name} Stats`,
            });

            // Fetch balances
            const balanceResponse = await instance.get(`/balances/group/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBalances(balanceResponse.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des données du groupe ou des soldes :", error);
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

    const data = balances
        .filter(balance => balance.idUser !== null)
        .map(balance => ({
            name: `${balance.idUser.firstname} ${balance.idUser.lastname}`,
            amount: balance.balance,
            color: generateColor(),
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
        }));

    const barChartData = {
        labels: data.map(item => item.name),
        datasets: [
            {
                data: data.map(item => item.amount),
                colors: data.map(() => () => `rgba(0, 0, 255, 0.7)`) // Couleur des barres en bleu
            }
        ]
    };

    const screenWidth = Dimensions.get('window').width;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Vos statistiques de groupe</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : balances.length === 0 ? (
                <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>Votre groupe n'a pas encore été actif !</Text>
                </View>
            ) : (
                <>
                    <PieChart
                        data={data.map(item => ({ ...item, name: '' }))}  // Suppression des noms dans la légende par défaut
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={pieChartConfig}
                        accessor="amount"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                        style={styles.chart}
                    />
                    <View style={styles.legendContainer}>
                        {data.map((item, index) => (
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
                    <View style={styles.separator} />
                    <BarChart
                        data={barChartData}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={barChartConfig}
                        fromZero
                        showBarTops={false}
                        style={styles.chart}
                    />
                </>
            )}
        </ScrollView>
    );
}

const pieChartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
};

const barChartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#ffffff",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Couleur des barres en bleu
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 2, // optional, defaults to 2dp
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
        borderRadius: 16,
    },
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
