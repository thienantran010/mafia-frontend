import Library from "../components/Library";
import BallotController from '../components/BallotController';
import ChatController from "../components/ChatController";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import ListenToActionsChange from "../listeners/actionsListener";
import ListenToMessagesChange from "../listeners/messageListener";
import ListenToLibraryChange from "../listeners/libraryListener";
import Grid from "@mui/material/Unstable_Grid2";
import socket from '../socket';
import { MafiaRoles } from "../types/gameTypes";
import { Button } from "@mui/material";

// types
import { gameJson } from '../types/gameTypes';

export default function Game() {
    const { gameId } = useParams();
    const [game, setGame] = useState<gameJson>();
    const [message, setMessage] = useState("Loading game...");
    const { username, accessToken, isLoading } = useAuth();

    const mafiaRoles : Set<MafiaRoles> = new Set(["Kamikaze", "Mafia", "Godfather", "Toaster"]);

    useEffect(() => {
        async function getGame(gameId : string) : Promise<gameJson> {
            const options : RequestInit = {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${accessToken}`
                }
            }
    
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/activeGames/getActiveGame/${gameId}`, options);
            const data = await response.json();
            return data.activeGame;
        }

        if (!isLoading && gameId) {
            getGame(gameId).then((game) => {
                if (game) {
                    setGame(() => game);
                    socket.connect();
                    socket.emit('all', gameId);

                    if (mafiaRoles.has(game.players[username].role as MafiaRoles)) {
                        socket.emit('mafia', gameId);
                    }

                    else if (game.players[username].role === 'Cop') {
                        socket.emit('cop', gameId);
                    }

                    ListenToActionsChange(socket, gameId, setGame);
                    ListenToMessagesChange(socket, setGame);
                    ListenToLibraryChange(socket, setGame);
                                      
                }
                else {
                    setMessage(() => "Could not load game");
                }
            })
        }

    }, [isLoading])

    const isDay = game ? game.library.length % 2 === 1 : false;
    const isAlive = game ? game.players[username].isAlive : false;
    const isMafia = game ? mafiaRoles.has(game.players[username].role as MafiaRoles) : false;
    const isCop = game ? game.players[username].role === 'Cop' : false;

    const testLibrary = [
        ["A was killed by the mafia.", "B is sided with the village.", "C was killed by the sniper."],
        ["D was executed by the village.", "E was blown up by the kamikaze."]
    ]
    return (
        game && gameId? 
            <>
            <Grid container>
                <Grid xs={9}>
                    <ChatController allChat={game.allChat} mafiaChat={isMafia ? game.mafiaChat : undefined} 
                    copChat={isCop ? game.copChat : undefined} isDay={isDay} isAlive={isAlive} gameId={gameId} />
                </Grid>
                <Grid xs={3}>
                    <BallotController players={game.players} isDay={isDay} actions={game.actions} gameId={gameId} library={testLibrary}/>
                </Grid>
            </Grid>
            </>
        :
            <h1>{message}</h1>
    )
}