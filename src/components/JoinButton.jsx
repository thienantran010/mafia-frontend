import { useState } from 'react';
import { Button } from '@mui/material';
import { useAuth } from '../providers/AuthProvider';

export default function JoinButton( {children, gameId, isInGame }) {
    const { accessToken } = useAuth();
    async function handleClick(event) {
        const options = {
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
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/removePlayerFromGame`, options);
            }
            else {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/addPlayerToGame`, options);
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