import { List, ListItemButton, Typography } from '@mui/material';
import { activeGameListItem } from '../types/activeGameTypes';
import { useNavigate } from 'react-router-dom';
interface activeGame {
    id: string;
    name: string;
}
function ActiveGame({id, name} : activeGame) {
    const navigate = useNavigate();

    async function handleClick() {
        navigate(`/game/${id}`);
    }
    return (
        <ListItemButton key={id} onClick={handleClick}>
            <Typography>{name}</Typography>
        </ListItemButton>
    )
}

interface activeGamesList {
    activeGames: activeGameListItem[];
}

export default function ActiveGames({activeGames} : activeGamesList) {
    return (
        <List>
            {activeGames.map((activeGame) => {
                return (
                    <ActiveGame key={activeGame.id} id={activeGame.id} name={activeGame.name} />
                )
            })}
        </List>
    )
}