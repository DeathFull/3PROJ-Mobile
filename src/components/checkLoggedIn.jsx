import AsyncStorage from '@react-native-async-storage/async-storage';
import instance from '../api/ApiConfig';
export const checkLoggedIn = async () => {
    try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
            try {
                const response = await instance.get('users/', {
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    }
                });
                const userData = response.data;
                AsyncStorage.setItem("userData", JSON.stringify(userData))
                    .then(() => {
                        console.log("userData stored");
                    })
                    .catch(error => {
                        console.log("error storing userData");
                    });
                return { isLoggedIn: true, userData: response.data };
            } catch (error) {
                console.log("a été deconnecté");
                return { isLoggedIn: false, userData: null };
            }
        } else {
            return { isLoggedIn: false, userData: null };
        }
    } catch (error) {
        return { isLoggedIn: false, userData: null };
    }
};
