import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
        orangeButton: {
            backgroundColor: '#D27E00',
            padding: 10,
            borderRadius: 5,
            width: '100%',
            alignItems: 'center',
            marginBottom: 10,
        },
        orangeButtonText: {
            color: 'white',
            fontSize: 16,
        },
        closeButton: {
            padding: 10,
            width: '100%',
            alignItems: 'center',
            marginTop: 10,
        },
        errorText: {
            color: 'red',
            marginBottom: 10,
        },
        successText: {
            color: 'green',
            marginBottom: 10,
        },
        menuItem: {
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
        },
        expenseForm: {
            width: '100%',
            marginBottom: 20,
        },
        expenseContainer: {
            width: '100%',
            marginBottom: 20,
        },
        addButton: {
            backgroundColor: '#D27E00',
            padding: 10,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
        },
        addButtonText: {
            color: 'white',
            fontSize: 16,
        },
        expenseItem: {
            width: '100%',
            marginBottom: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        expenseText: {
            fontSize: 16,
            color: '#7F7F7F',
        },
        modalButtons: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
        },
        confirmButton: {
            backgroundColor: '#D27E00',
            padding: 10,
            borderRadius: 5,
            width: '40%',
            alignItems: 'center',
        },
        confirmButtonText: {
            color: 'white',
            fontSize: 16,
        },
        cancelButton: {
            backgroundColor: '#ccc',
            padding: 10,
            borderRadius: 5,
            width: '40%',
            alignItems: 'center',
        },
        cancelButtonText: {
            color: 'black',
            fontSize: 16,
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

    closeButtonText: {
        color: '#007bff',
        fontSize: 16,
    },
});

export default styles;
