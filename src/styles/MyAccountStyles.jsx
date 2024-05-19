import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 60,
    },
    cardContainer: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 10,
    },
    card: {
        width: '90%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ibanText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    groupInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    memberCount: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 5,
    },
    groupDetails: {
        flex: 1,
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    welcomeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 5,
    },
    userDataText: {
        fontSize: 20,
    },
    ibanSectionContainer: {
        width: '100%',
        alignItems: 'center',
    },
    titleContainer: {
        marginTop: 100,
        alignItems: 'center',
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    newButtonContainer: {
        marginTop: 30,
        width: '100%',
        alignItems: 'center',
    },
    newButton: {
        width: '70%',
        height: 100,
        backgroundColor: '#ccc',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 20,
        color: 'black',
    },
    groupText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 10,
        textAlign: 'center',
    },
    button: {
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
    editButton: {
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    editButtonText: {
        color: 'white',
        fontSize: 14,
    },
});

export default styles;
