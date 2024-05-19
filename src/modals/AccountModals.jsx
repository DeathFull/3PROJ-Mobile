import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import styles from '../styles/ModalStyles';

const AccountModals = ({
                           showIbanModal,
                           showGroupModal,
                           showOptionsModal,
                           iban,
                           setIban,
                           groupName,
                           setGroupName,
                           groupDescription,
                           setGroupDescription,
                           updateIban,
                           createGroup,
                           errorMessage,
                           successMessage,
                           loading,
                           toggleIbanModal,
                           toggleGroupModal,
                           toggleOptionsModal,
                       }) => {
    return (
        <>
            <Modal
                visible={showIbanModal}
                transparent={true}
                animationType="slide"
                onRequestClose={toggleIbanModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Entrer les informations de l'IBAN</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="IBAN"
                            value={iban}
                            onChangeText={setIban}
                        />
                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <>
                                <TouchableOpacity style={styles.orangeButton} onPress={() => {
                                    updateIban().then();
                                    toggleIbanModal();
                                }}>
                                    <Text style={styles.orangeButtonText}>Soumettre</Text>
                                </TouchableOpacity>
                                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                                {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
                            </>
                        )}
                        <TouchableOpacity style={[styles.closeButton, styles.orangeButton]} onPress={toggleIbanModal}>
                            <Text style={styles.orangeButtonText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showOptionsModal}
                transparent={true}
                animationType="slide"
                onRequestClose={toggleOptionsModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={[styles.menuItem, styles.orangeButton]} onPress={() => { toggleOptionsModal(); toggleGroupModal(); }}>
                            <Text style={styles.orangeButtonText}>Créer un groupe</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.menuItem, styles.orangeButton]} onPress={toggleOptionsModal}>
                            <Text style={styles.orangeButtonText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showGroupModal}
                transparent={true}
                animationType="slide"
                onRequestClose={toggleGroupModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Créer un groupe</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nom du groupe"
                            value={groupName}
                            onChangeText={setGroupName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Description"
                            value={groupDescription}
                            onChangeText={setGroupDescription}
                        />
                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <>
                                <TouchableOpacity style={styles.orangeButton} onPress={createGroup}>
                                    <Text style={styles.orangeButtonText}>Soumettre</Text>
                                </TouchableOpacity>
                                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                                {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
                            </>
                        )}
                        <TouchableOpacity style={[styles.closeButton, styles.orangeButton]} onPress={toggleGroupModal}>
                            <Text style={styles.orangeButtonText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default AccountModals;
