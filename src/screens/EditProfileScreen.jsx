import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import mime from 'mime';
import instance from '../api/ApiConfig';

export default function EditProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const storedUserData = await AsyncStorage.getItem('userData');

        if (!token || !storedUserData) {
          navigation.navigate('WelcomeScreen');
          return;
        }

        const user = JSON.parse(storedUserData);
        setUserData(user);
        setFirstname(user.firstname);
        setLastname(user.lastname);
        setEmail(user.email);
        setAvatar(user.avatar ? `${user.avatar}?t=${new Date().getTime()}` : null);
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, []);

  const fetchUpdatedUserData = async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await instance.get(`/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const updatedUserData = {
        ...userData,
        firstname,
        lastname,
        email,
        avatar,
      };

      // Update user data
      await instance.put(`/users`, updatedUserData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newImageUri = "file:///" + avatar.split("file:/").join("");
      const mimeType = mime.getType(newImageUri);

      const formData = new FormData();
      formData.append('file', {
        uri: newImageUri,
        name: newImageUri.split("/").pop(),
        type: mimeType || 'application/octet-stream'
      });

      const response = await instance.post(`/users/updateImage`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Fetch updated user data from API after updating the avatar
      const updatedUser = await fetchUpdatedUserData();
      setUserData(updatedUser);
      setAvatar(updatedUser.avatar ? `${updatedUser.avatar}?t=${new Date().getTime()}` : null);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save user data:', error);
      Alert.alert('Error', 'Failed to save user data');
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      console.log('Image selected:', uri);
      setAvatar(uri);
    } else {
      console.log('Image selection canceled');
    }
  };

  if (!userData || loading) {
    return (
        <View style={styles.loadingContainer}>
          <Text>{loading ? 'Saving...' : 'Loading...'}</Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Modifier le profil</Text>
        <TouchableOpacity onPress={handlePickImage}>
          {avatar ? (
              <Image source={{ uri: avatar }} style={styles.profileImage} />
          ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImagePlaceholderText}>Ajouter une photo de profil</Text>
              </View>
          )}
        </TouchableOpacity>
        <TextInput
            style={styles.input}
            placeholder="Prénom"
            value={firstname}
            onChangeText={setFirstname}
        />
        <TextInput
            style={styles.input}
            placeholder="Nom de famille"
            value={lastname}
            onChangeText={setLastname}
        />
        <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
        />
        <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Enregistrer les modifications</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
    textAlign: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImagePlaceholderText: {
    color: '#fff',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#D27E00',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '70%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
