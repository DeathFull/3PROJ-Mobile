import AsyncStorage from '@react-native-async-storage/async-storage';
import instance from '../api/ApiConfig';

export const checkLoggedIn = async () => {
    try {
        const storedToken = await AsyncStorage.getItem("token");
        console.log("Test du token Checkloggedin :", storedToken);
        if (storedToken) {
            try {
                const response = await instance.get('users/', {
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    }
                });
                console.log("User data: ", response.data);
                return { isLoggedIn: true, userData: response.data };
            } catch (error) {
                console.error("Erreur lors de la récupération des informations utilisateur :", error);
                return { isLoggedIn: false, userData: null };
            }
        } else {
            return { isLoggedIn: false, userData: null };
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du token depuis AsyncStorage :", error);
        return { isLoggedIn: false, userData: null };
    }
};
