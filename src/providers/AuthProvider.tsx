import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// types
import { ReactNode } from 'react';
interface Props {
    children?: ReactNode
}

interface authInterface {
    accessToken: string;
    setAccessToken: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
}

const authDefaultValue = {
    accessToken: "",
    setAccessToken: () => {},
    isLoading: true,
    username: "",
    setUsername: () => {}
}
const AuthContext = createContext<authInterface>(authDefaultValue);


const AuthProvider = ({ children }: Props) => {
    const [accessToken, setAccessToken] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const refreshToken = async () => {
            const options : RequestInit = {
                method: 'POST',
                credentials: "include"
            }
        
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, options);
            return response;
        }

        const handleRefresh = async () => {

            const response = await refreshToken();

            // couldn't refresh, try logging in
            if (response.status >= 400) {
                navigate('/login')
            }
            else {
                const data = await response.json();
                setAccessToken(data.accessToken);
                setUsername(data.username);
            }
            
        }

        if (!accessToken) {
            handleRefresh()
            .then(() => {
                setIsLoading(false);
                console.log('Refreshed token')
            })
            .catch((error) => console.log(error));
        }

    }, [accessToken]);
    return (
        <AuthContext.Provider value={{accessToken, setAccessToken, isLoading, username, setUsername}}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext);

export {
    AuthProvider,
    useAuth
}