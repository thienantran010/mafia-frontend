import { List, ListItemButton, ListItemText, Typography,
            Divider, Collapse, ListItem} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import BasicTabs from './BasicTabs';
import JoinButton from './JoinButton';
import CreateGameDialog from './CreateGameDialog';
import { socket } from '../socket';
import { useAuth } from '../providers/AuthProvider';

function OpenGame( {numPlayersJoined, numPlayersMax, name, roles, players, id, isInGame} ) {
    const [isOpen, setIsOpen] = useState(false);
    const handleClick = () => {
        setIsOpen(!isOpen);
    }

    const playersComponent = <List>
        {players.map((player) => {
            return (<ListItem><Typography>{player}</Typography></ListItem>)
        })}
    </List>

    const rolesComponent = <List>
    {roles.map((role) => {
        return (<ListItem><Typography>{role}</Typography></ListItem>)
    })}
    </List>

    const example = [
        {name: "Roles", contents: rolesComponent, key: "roles"},
        {name: "Players", contents: playersComponent, key: "players"}
    ]
    return (
        <>
            <ListItem key={id}>
                <ListItemButton onClick={handleClick}>
                    <ListItemText>{name}</ListItemText>
                        {numPlayersJoined} / {numPlayersMax}
                        {isOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <JoinButton gameId={id} isInGame={isInGame}></JoinButton>
            </ListItem>
            <Collapse in={isOpen} timeout="auto" unmountOnExit sx={{display: "block"}}>
                    <BasicTabs tabs={example}/>
            </Collapse>
            <Divider />
        </>
    )
}

export default function OpenGames() {
    const [openGames, setOpenGames] = useState([]);
    const {accessToken, setAccessToken, isLoading, username} = useAuth();

    console.log('rendering opengames');
    useEffect(() => {
    
        console.log('running effect');
        async function getAllOpenGames() {
            const options = {
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

        if (!isLoading) {
            getAllOpenGames().then((data) => {
                setOpenGames(() => data);
                console.log('Games retrieved from database');

                socket.connect();

                function deleteOpenGame(gameId) {
                    const filteredGames = openGames.filter((openGame) => {
                        return openGame.id != gameId;
                    })
                    // setOpenGames(filteredGames);
                }
        
                function createOpenGame(game) {
                    console.log(game);
                    setOpenGames((openGames) => [...openGames, game]);
                }
        
                function updateGameLeave(gameId, numPlayersJoined, playerObjs) {
                    setOpenGames((openGames) => {
                        let newGameList = [...openGames];
                        newGameList.forEach((game) => {
                            if (game._id === gameId) {
                                game.numPlayersJoined = numPlayersJoined;
                                game.players = playerObjs;
                            }
                        });
                        console.log(`GameId: ${gameId}, numPlayersJoined: ${numPlayersJoined}, usernames: ${playerObjs}`);
                        console.log(newGameList);
                        return newGameList;
                    });
                }

                function updateGameJoin(gameId, numPlayersJoined, playerObjs) {
                    setOpenGames((openGames) => {
                        let newGameList = [...openGames];
                        newGameList.forEach((game) => {
                            if (game._id === gameId) {
                                game.numPlayersJoined = numPlayersJoined;
                                game.players = game.players.concat(playerObjs);
                            }
                        });
                        console.log(newGameList);
                        return newGameList;
                    });  
                }
        
                socket.on('openGame:create', createOpenGame);
                // socket.on('openGame:delete', deleteOpenGame);
                socket.on('openGame:update:join', updateGameJoin);
                socket.on('openGame:update:leave', updateGameLeave);
        
                return (() => {
                    console.log('disconnecting');
                    socket.disconnect();
                })
            })
        }
    }, [isLoading]);

    let openGameComponents = []
    if (openGames.length > 0) {
        openGameComponents = openGames.map(({_id, name, roles, players, numPlayersJoined, numPlayersMax}) => {
            const playerUsernames = players.map((player) => player.username);
            if (playerUsernames.includes(username)) {
                console.log('ingame');
                return (<OpenGame id={_id} name={name} roles={roles} 
                    players={playerUsernames} numPlayersJoined={numPlayersJoined} numPlayersMax={numPlayersMax} isInGame={true}/>);
            }
            else {
                console.log('not ingame');
                return (<OpenGame id={_id} name={name} roles={roles} 
                    players={playerUsernames} numPlayersJoined={numPlayersJoined} numPlayersMax={numPlayersMax} isInGame={false}/>);
            }
        });
    }
    else {
        openGameComponents = [<Typography>No open games...</Typography>];
    }

    return (
        <>
            <List>
                {openGameComponents};
            </List>
            <CreateGameDialog />
        </>
    )
}