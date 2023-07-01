import { useAuth } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

export default function LogoutButton() {
    const {accessToken, setAccessToken} = useAuth();
    const navigate = useNavigate();
    async function handleClick() {
        const options = {
            method: "POST",
            credentials: "include"
        }
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, options);
        const data = await response.json();
        setAccessToken("");
        navigate("/login");
    }

    return (
        <Button onClick={handleClick} variant="contained">Log Out</Button>
    )

}