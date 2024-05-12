import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function MyAccount() {
    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    return (
        <View style={styles.container}>
            <View style={styles.ribContainer}>
                <Text style={styles.ribText}>1234 5678 9012 3456</Text>
            </View>
            <Text style={styles.groupText}>Mes groupes</Text>

            <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
                <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
            <Modal
                visible={showModal}
                transparent={true}
                animationType="slide"
                onRequestClose={toggleModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => console.log("Créer un groupe")}>
                            <Text style={styles.menuItemText}>Créer un groupe</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => console.log("Rejoindre un groupe")}>
                            <Text style={styles.menuItemText}>Rejoindre un groupe</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={toggleModal}>
                            <Text style={styles.menuItemText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ribContainer: {
        width: 200,
        height: 100,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    ribText: {
        fontSize: 18,
    },
    groupText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    addButton: {
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
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    menuItemText: {
        fontSize: 18,
    },
});

export default MyAccount;
