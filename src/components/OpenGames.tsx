import { List, ListItemButton, ListItemText, Typography,
    Divider, Collapse, ListItem} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useState } from 'react';
import BasicTabs from './BasicTabs';
import JoinButton from './JoinButton';
import CreateGameDialog from './CreateGameDialog';
import {openGame } from '../types/openGameTypes';

function OpenGame( {numPlayersJoined, numPlayersMax, name, roles, playerObjs, id, isInGame} : openGame ) {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
    }

    const playersComponent = 
    <List>
        {playerObjs.map((playerObj) => {
            return (<ListItem key={playerObj.id}><Typography>{playerObj.username}</Typography></ListItem>)
        })}
    </List>

    const rolesComponent = 
        <List>
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

export default function OpenGames({ openGames, username } : { openGames: openGame[], username: string}) {

    let openGameComponents = []
    if (openGames.length > 0) {
        openGameComponents = openGames.map(({id, name, roles, playerObjs, numPlayersJoined, numPlayersMax}) => {
            const playerUsernames = playerObjs.map((playerObj) => playerObj.username);
            return (<OpenGame id={id} name={name} roles={roles} 
                playerObjs={playerObjs} numPlayersJoined={numPlayersJoined} numPlayersMax={numPlayersMax} isInGame={playerUsernames.includes(username)}/>);
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