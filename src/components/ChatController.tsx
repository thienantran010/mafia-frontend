import BasicTabs from "./BasicTabs";
import SimpleDialog from './SimpleDialog';
import { messageJson } from "../types/gameTypes";
import { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, TextField, Button, Stack, } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';


function Messages( { messages } : { messages: messageJson[]}) {
    return (

        // temporary solution, maxHeight should be adjusted using useRef
        <List style={{maxHeight: `70vh`, overflow: 'auto'}}>
            {messages.map((message, index) => {
                return (
                    <ListItem alignItems="flex-start" key={index}>
                        <ListItemAvatar>
                            <Avatar alt="" src={message.picture}/>
                        </ListItemAvatar>
                        <ListItemText 
                            primary={message.username}
                            secondary={message.content}
                        />
                    </ListItem>
                )
            })}
        </List>
    )
}

interface ChatProps {
    allChat?: messageJson[];
    copChat?: messageJson[];
    mafiaChat?: messageJson[];
    isDay: boolean;
    isAlive: boolean;
    gameId: string;
}
function Chat({ allChat, mafiaChat, copChat, isDay, isAlive, gameId } : ChatProps) {

    const { username, accessToken } = useAuth();
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState({title: "", text: ""});
    const [text, setText] = useState("");

    const messages = (allChat || mafiaChat || copChat) as messageJson[];

    const postMessage = async (content : string) => {
        const options : RequestInit= {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({content})
        }
        const endpoint = allChat ? "all" : mafiaChat ? "mafia" : "cop"
        const data = await fetch(`${import.meta.env.VITE_BACKEND_URL}/activeGames/postMessage/${gameId}/${endpoint}`, options);
        const json = await data.json();
        console.log(json.message);
    }

    const handleChange : React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setText(event.target.value);
    }

    const handleEnterKeyDown :  React.KeyboardEventHandler<HTMLDivElement> = (event) => {
        if (event.key === "Enter") {
            if (!isAlive) {
                setOpenDialog(true);
                setDialogContent({title: "Can't send messages", text: "You're dead. You can't send any messages."})
            }
    
            else if (mafiaChat && isDay) {
                setOpenDialog(true);
                setDialogContent({title: "Can't send messages", text: "You can't use the mafia chat during the day"})
            }
    
            else if (copChat && isDay) {
                setOpenDialog(true);
                setDialogContent({title: "Can't send messages", text: "You can't use the cop chat during the day"})
            }

            else {
                postMessage(text);
                setText("");
            }
        }
    }

    const handleClick :  React.MouseEventHandler<HTMLButtonElement> = (event) => {
        if (!isAlive) {
            setOpenDialog(true);
            setDialogContent({title: "Can't send messages", text: "You're dead. You can't send any messages."})
        }

        else if (mafiaChat && isDay) {
            setOpenDialog(true);
            setDialogContent({title: "Can't send messages", text: "You can't use the mafia chat during the day"})
        }

        else if (copChat && isDay) {
            setOpenDialog(true);
            setDialogContent({title: "Can't send messages", text: "You can't use the cop chat during the day"})
        }

        else {
            postMessage(text);
            setText("");
        }
    }
    return (
        <>
        <Stack>
            <Messages messages={messages} />
            <Stack direction="row" alignItems="center" spacing={1}>
                <TextField onKeyDown={handleEnterKeyDown} onChange={handleChange} multiline fullWidth/>
                <Button variant="contained" onClick={handleClick}>Post</Button>
            </Stack>
        </Stack>
        <SimpleDialog openDialog={openDialog} setOpenDialog={setOpenDialog} 
        title={dialogContent.title} text={dialogContent.text}/>
        </>
    )
}

interface ChatControllerProps {
    allChat: messageJson[];
    mafiaChat: messageJson[] | undefined;
    copChat: messageJson[] | undefined;
    gameId: string;
    isDay: boolean;
    isAlive: boolean;
}
export default function ChatController({ allChat, mafiaChat, copChat, gameId, isDay, isAlive} : ChatControllerProps) {
    const tabs = [
        {
            name: "All Chat",
            contents: <Chat allChat={allChat} gameId={gameId} isDay={isDay} isAlive={isAlive}/>,
            key: "All Chat"
        }
    ]

    if (mafiaChat !== undefined) {
        tabs.push (
            {
                name: "Mafia Chat",
                contents: <Chat mafiaChat={mafiaChat} gameId={gameId} isDay={isDay} isAlive={isAlive}/>,
                key: "Mafia Chat"
            }
        )
    }

    else if (copChat !== undefined) {
        tabs.push (
            {
                name: "Cop Chat",
                contents: <Chat copChat={copChat} gameId={gameId} isDay={isDay} isAlive={isAlive}/>,
                key: "Cop Chat"
            }
        )
    }

    return (
        <BasicTabs tabs={tabs} />
    )
}