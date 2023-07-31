import { useAuth } from '../providers/AuthProvider';
import { FormControl, FormLabel, FormControlLabel, RadioGroup, Typography, Radio, Alert, AlertTitle } from '@mui/material';
import { playersJson, actionJson, MafiaRoles, Role, action } from '../types/gameTypes';
import { useState, useEffect, ReactNode } from 'react';
import BasicTabs from './BasicTabs';
import SimpleDialog from './SimpleDialog';
import Library from './Library';

interface BallotProps {
    alivePlayers: {
        username: string;
        playerId: string;
        isAlive: boolean;
        role: Role,
        numActionsLeft: number
    }[];
    isDay: boolean;
    gameId: string;
    actions: actionJson[];
}

function DayBallot({ alivePlayers, isDay, gameId, actions } : BallotProps) {
    const { username, accessToken } = useAuth();
    const [openDialog, setOpenDialog] = useState(false);

    let vote = "";
    const userAction = actions[actions.length - 1][username];
    if (userAction) {
        vote = userAction.dayVote ? userAction.dayVote : vote;
    }

    const mafiaRoles : Set<MafiaRoles> = new Set(["Kamikaze", "Mafia", "Godfather", "Toaster"]);
    const player = alivePlayers.filter((player) => player.username === username)[0];
    let isMafia = false;
    if (mafiaRoles.has(player.role as MafiaRoles)) {
        isMafia = true;
    }
    const labelMafiaRole = (role : string) => {
        return <Typography color="red">{role}</Typography>;
    }

    const dialogTitle = "You can't vote"
    const dialogText = "You can't use the day ballot when it's night..."
    const postVote = async (vote : string) => {
        const options : RequestInit= {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({vote})
        }
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/activeGames/postAction/${gameId}`, options);
    }

    const handleClick : React.MouseEventHandler<HTMLLabelElement> = async (event) => {
        if (!isDay) {
            setOpenDialog(true);
        }

        // i think label is nested in button, so when clicking on label the event bubbles to button
        // label has a value of undefined so we don't want to post vote when the value is undefined
        else if ((event.target as HTMLInputElement).value !== undefined) {
            await postVote((event.target as HTMLInputElement).value);
            console.log('sent vote in');
        }
      };

    const radioButtons = alivePlayers.map((player) => {
        let label : string | ReactNode = player.username;
        if (isMafia && mafiaRoles.has(player.role as MafiaRoles)) {
            label = <Typography>{player.username}<Typography color="red" component="span"> ({player.role})</Typography></Typography>
        }

        return (
                <FormControlLabel key={player.username} value={player.username} control={<Radio />} label={label} onClick={handleClick}/>
        )
    })

    return (
        <>
            <FormControl>
                <FormLabel id="dayBallotLabel">Day Vote</FormLabel>
                <RadioGroup name="dayBallot" aria-labelledby="dayBallotLabel" value={vote}>
                    {radioButtons}
                </RadioGroup>
            </FormControl>
            <SimpleDialog openDialog={openDialog} setOpenDialog={setOpenDialog} 
                            title={dialogTitle} text={dialogText}/>
        </>
    )
}


function ActionBallot({ alivePlayers, isDay, gameId, actions } : BallotProps) {
    const { username, accessToken } = useAuth();
    const [openDialog, setOpenDialog] = useState(false);


    let vote = "";
    const userAction = actions[actions.length - 1][username];
    if (userAction) {
        vote = userAction.actionVote ? userAction.actionVote : vote;
    }

    const mafiaRoles : Set<MafiaRoles> = new Set(["Kamikaze", "Mafia", "Godfather", "Toaster"]);
    const nightRoles : Set<Role> = new Set(["Mafia", "Godfather", "Toaster", 
                                            "Cop", "Creeper", "Doctor",
                                            "Sniper", "Bulletproof", "Gravedigger"]);
    const dayRoles : Set<Role> = new Set(["Kamikaze"]);

    const player = alivePlayers.filter((player) => player.username === username)[0];
    const playerRole = player.role;
    const numActionsLeft = player.numActionsLeft;
    let isMafia = false;
    if (mafiaRoles.has(player.role as MafiaRoles)) {
        isMafia = true;
    }

    const dialogTitle = "You can't vote"
    const dialogText = "Cannot perform an action"
    const postVote = async (vote : string) => {
        const options : RequestInit= {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({actionVote: vote})
        }

        /*
        const data = await fetch(`${import.meta.env.VITE_BACKEND_URL}/activeGames/test/${gameId}`, options);
        const json = await data.json()
        console.log(json.message);
        */
        const data = await fetch(`${import.meta.env.VITE_BACKEND_URL}/activeGames/postAction/${gameId}`, options);
        const json = await data.json();
        console.log(json.message);
    }

    // we do not make vote a state - we have an event handler that lets the database know that the vote
    // was changed. then, the vote emits an event to the parent component (the game component) which
    // passes the vote back down
    const handleClick : React.MouseEventHandler<HTMLLabelElement> = async (event) => {

        // infinity is converted to null in JSON
        if (isDay && nightRoles.has(playerRole) || !isDay && dayRoles.has(playerRole) || (numActionsLeft !== null && numActionsLeft <= 0)) {
            setOpenDialog(true);
        }

        // i think label is nested in button, so when clicking on label the event bubbles to button
        // label has a value of undefined so we don't want to post vote when the value is undefined
        else if ((event.target as HTMLInputElement).value !== undefined) {
            await postVote((event.target as HTMLInputElement).value);
            console.log('sent vote in');
        }
      };

    const radioButtons = alivePlayers.map((player) => {
        let label : string | ReactNode = player.username;
        if (isMafia && mafiaRoles.has(player.role as MafiaRoles)) {
            label = <Typography>{player.username}<Typography color="red" component="span"> ({player.role})</Typography></Typography>
        }

        return (
                <FormControlLabel key={player.username} value={player.username} control={<Radio />} label={label} onClick={handleClick}/>
        )
    })

    return (
        <>
            <FormControl>
                <FormLabel id="actionBallotLabel">Action Vote</FormLabel>
                <RadioGroup name="actionBallot" aria-labelledby="actionBallotLabel" value={vote}>
                    {radioButtons}
                </RadioGroup>
            </FormControl>
            <SimpleDialog openDialog={openDialog} setOpenDialog={setOpenDialog} 
                            title={dialogTitle} text={dialogText}/>
        </>
    )

}

interface BallotControllerProps {
    players: playersJson;
    isDay: boolean;
    actions: actionJson[];
    gameId: string;
    library: string[][];
}
export default function BallotController( { players, isDay, actions, gameId, library } : BallotControllerProps) {
    const { username } = useAuth();

    const alivePlayers = []

    for (const username in players) {
        if (players[username].isAlive) {
            alivePlayers.push({username: username, ...players[username]});
        }
    }

    const playerRole = players[username].role;
    const tabs = [
        {
            name: "Day Vote",
            contents: <DayBallot alivePlayers={alivePlayers} isDay={isDay} gameId={gameId} actions={actions}/>,
            key: "Day Vote"
        }
    ]

    if (playerRole !== 'Bulletproof' && playerRole !== 'Villager') {
        tabs.push({
            name: "Action Vote",
            contents: <ActionBallot alivePlayers={alivePlayers} isDay={isDay} gameId={gameId} actions={actions}/>,
            key: "Action Vote"
        });
    }

    tabs.push({
        name: "Library",
        contents: <Library library={library}></Library>,
        key: "Library"
    })

    return (
        <BasicTabs tabs={tabs} />
    )
}