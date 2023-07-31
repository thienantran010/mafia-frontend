import { useAuth } from '../providers/AuthProvider';
import { Typography } from '@mui/material';
import LogoutButton from '../components/LogoutButton';
import OpenGames from '../components/OpenGames';
import BasicTabs from '../components/BasicTabs';
import ActiveGames from '../components/ActiveGames';
import { useEffect, useState } from 'react';

// types
import { playerObj, openGame } from '../types/openGameTypes';
import { activeGameListItem } from '../types/activeGameTypes';
import socket from '../socket';

export default function Home() {
    const [openGames, setOpenGames] = useState<openGame[]>([]);
    const [activeGames, setActiveGames] = useState<activeGameListItem[]>([]);
    const {accessToken, isLoading, username} = useAuth();

    useEffect(() => {

    console.log('running effect');
    async function getAllOpenGames() {
        const options : RequestInit = {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${accessToken}`
            }
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getAllOpenGames`, options);
        const data = await response.json();
        return data.openGames;
    }

    async function getYourActiveGames() {
        const options : RequestInit = {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${accessToken}`
            }
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/activeGames/getUserActiveGames`, options);
        const data = await response.json();
        console.log(data.activeGames);
        return data.activeGames;
    }

    if (!isLoading) {
        getAllOpenGames().then((data) => {
            setOpenGames(() => data);
            console.log(data);
            console.log('Games retrieved from database');

            socket.connect();

            
            function deleteOpenGame(gameId : string) {
                setOpenGames((openGames) => {
                    const filteredGames = openGames.filter((openGame) => {
                        return openGame.id != gameId;
                    })
                    console.log('game deleted')
                    return filteredGames
                });
            }

            function createOpenGame(game : openGame) {
                setOpenGames((openGames) => {
                    return [...openGames, game];
                });
            }

            function updateGameLeave(gameId : string, numPlayersJoined : number, playerObjs : playerObj[]) {
                setOpenGames((openGames) => {
                    let newGameList = [...openGames];
                    newGameList.forEach((game) => {
                        if (game.id === gameId) {
                            game.numPlayersJoined = numPlayersJoined;
                            game.playerObjs = playerObjs;
                        }
                    });
                    console.log('player left game')
                    return newGameList;
                });
            }

            function updateGameJoin(gameId : string, numPlayersJoined : number, playerObjs : playerObj[]) {
                setOpenGames((openGames) => {
                    let newGameList = [...openGames];
                    newGameList.forEach((game) => {
                        if (game.id === gameId) {
                            game.numPlayersJoined = numPlayersJoined;
                            game.playerObjs = game.playerObjs.concat(playerObjs);
                        }
                    });
                    console.log('player joined game');
                    return newGameList;
                });  
            }

            socket.on('openGame:create', createOpenGame);
            socket.on('openGame:delete', deleteOpenGame);
            socket.on('openGame:update:join', updateGameJoin);
            socket.on('openGame:update:leave', updateGameLeave);

            return (() => {
                console.log('disconnecting');
                socket.disconnect();
            });
        });

        getYourActiveGames().then((activeGames) => {
            setActiveGames(() => activeGames);
            console.log('retrieved active games');

            socket.connect();

            function createActiveGame(activeGame : activeGameListItem) {
                setActiveGames((activeGames) => {
                    return [...activeGames, activeGame]
                });
            }

            function deleteActiveGame(activeGameId : string) {
                setActiveGames((activeGames) => {
                    const filteredGames = activeGames.filter((activeGame) => {
                        return activeGame.id != activeGameId;
                    })
                    return filteredGames;
                });
            }

            socket.on('activeGame:create', createActiveGame);
            socket.on('activeGame:delete', deleteActiveGame);

            return (() => {
                console.log('disconnecting');
                socket.disconnect();
            });
        })
    }
    }, [isLoading]);

    const tabs = [
        {name: "Open Games", contents: <OpenGames openGames={openGames} username={username}/>, key: "Open Games"},
        {name: "Your Games", contents: <ActiveGames activeGames={activeGames} />, key: "Your Games"}
    ]
    return (
        <>
            <BasicTabs tabs={tabs} />
            <LogoutButton />
            <Typography>You are logged in as ${username}</Typography>
        </>
    )
}