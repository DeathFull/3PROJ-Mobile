import React, { createContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({
    token: "",
    setToken: (token) => {},
    isLogged: () => false,
});
function AuthContextProvider({ children }) {
    const [token, setToken] = useState("");

    useEffect(() => {
        const getToken = async () => {
            try {
                const localToken = await AsyncStorage.getItem("token");
                if (localToken !== null) {
                    setToken(localToken);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du token :", error);
            }
        };

        getToken();
    }, []);

    const saveToken = async (newToken) => {
        try {
            await AsyncStorage.setItem("token", newToken);
            setToken(newToken);
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du token :", error);
        }
    };

    const isLogged = () => {
        return token !== "";
    };

    return (
        <AuthContext.Provider value={{ token, setToken: saveToken, isLogged }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthContextProvider };
