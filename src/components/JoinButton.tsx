import { Button } from '@mui/material';
import { useAuth } from '../providers/AuthProvider';

interface joinButtonProps {
    gameId: string;
    isInGame: boolean;
}
export default function JoinButton( {gameId, isInGame } : joinButtonProps) {
    const { accessToken } = useAuth();

    const handleClick : React.MouseEventHandler<HTMLButtonElement> = async (_) => {
        const options : RequestInit = {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({gameId}),
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${accessToken}`
            }
        }
        try {
            if (isInGame) {
                await fetch(`${import.meta.env.VITE_BACKEND_URL}/removePlayerFromGame`, options);
            }
            else {
                await fetch(`${import.meta.env.VITE_BACKEND_URL}/addPlayerToGame`, options);
            }
        }
        catch (error) {
            console.log(error);
        }
    }


    return (
        <Button onClick={handleClick}>{isInGame ? "Leave" : "Join"}</Button>
    )
}