import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({
    token: "",
    setToken: () => {},
    isLogged: () => false,
});

function AuthContextProvider({ children }) {
    const [token, setToken] = useState("");

    useEffect(() => {
        async function getTokenFromStorage() {
            try {
                const localToken = await AsyncStorage.getItem("token");
                if (localToken !== null) {
                    setToken(JSON.parse(localToken));
                }
            } catch (error) {
                console.error("Error retrieving token from AsyncStorage:", error);
            }
        }
        getTokenFromStorage();
    }, []);

    useEffect(() => {
        async function saveTokenToStorage() {
            try {
                await AsyncStorage.setItem("token", JSON.stringify(token));
            } catch (error) {
                console.error("Error saving token to AsyncStorage:", error);
            }
        }
        saveTokenToStorage();
    }, [token]);

    const isLogged = () => {
        return !!token;
    };

    return (
        <AuthContext.Provider value={{ token, setToken, isLogged }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthContextProvider };
