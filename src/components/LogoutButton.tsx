import { useAuth } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

export default function LogoutButton() {
    const {setAccessToken} = useAuth();
    const navigate = useNavigate();
    async function handleClick() {
        const options : RequestInit = {
            method: "POST",
            credentials: "include"
        }
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, options);
        setAccessToken("");
        navigate("/login");
    }

    return (
        <Button onClick={handleClick} variant="contained">Log Out</Button>
    )

}