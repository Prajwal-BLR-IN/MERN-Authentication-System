import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

type appContextPropType = {
    children: React.ReactNode;
}

type UserDataType = {
  name: string;
  isAccountVerified: boolean;
};

type appContextType = {
    backendUrl: string;
    isLoggedin: boolean;
    setIsLoggedin: React.Dispatch<React.SetStateAction<boolean>>;
    userData: UserDataType | null;
    setUserData: React.Dispatch<React.SetStateAction<UserDataType | null>>;
    getUserData: () => Promise<void>
}


export const AppContext = createContext<appContextType | null>(null);

//custom hook to prevent error in other components
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context;
};

export const AppContextProvider = ({ children }: appContextPropType) => {

    axios.defaults.withCredentials = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState<UserDataType | null>(null);

    const getAuthState = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth', { withCredentials: true })
            if(data.success){
                setIsLoggedin(true);
                await getUserData();
            }
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const getUserData = async () => {
        try {
            // const {data} = await axios.get(`${backendUrl}/api/user/data`);
            const { data }: { data: { success: boolean; userData: UserDataType } } = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });
            data.success ? setUserData(data.userData) : toast.error("Error fetching user data");
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getAuthState();
    }, [])

    const value: appContextType = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData,
    };


    return (
        <AppContext.Provider value={value} >
            {children}
        </AppContext.Provider>
    )
}