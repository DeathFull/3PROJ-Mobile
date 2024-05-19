import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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

export default styles;
