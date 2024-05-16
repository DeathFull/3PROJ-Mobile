import AsyncStorage from '@react-native-async-storage/async-storage';
import instance from '../api/ApiConfig';
//on check si on est loggedin / et on récupère en plus la data de l'utilisateur logged in en la stockant en local
export const checkLoggedIn = async () => {
    try {
        const storedToken = await AsyncStorage.getItem("token");
        console.log("Test du token Checkloggedin :", storedToken);
        if (storedToken) {
            try {
                //avec le token , on check si on peut avoir notre utilisateur
                const response = await instance.get('users/', {
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    }
                });
                const userData = response.data;
                console.log("User data: ", userData);
                //on stock l'utilisateur si on l'a récupéré , on stock les données
                AsyncStorage.setItem("userData", JSON.stringify(userData))
                    .then(() => {
                        //la je print juste pour vérifier la data stockée
                        AsyncStorage.getItem("userData")
                            .then(storedData => {
                                console.log("UserData Stored:", storedData);
                            })
                            .catch(error => {
                            });
                    })
                    .catch(error => {
                        console.log(error);
                    });
                return { isLoggedIn: true, userData: response.data };
            } catch (error) {
                //ça c'est si on se co et que le token est plus valide
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
