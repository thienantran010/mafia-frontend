import { List, ListItemButton } from '@mui/material';

interface yourGame {
    gameName: string;
}
function YourGame({ gameName } : yourGame) {
    return (
        <ListItemButton>{gameName}</ListItemButton>
    )
}
export default function YourGames() {
    return (
        <List>
            <YourGame gameName="test1"/>
            <YourGame gameName="test2"/>
            <YourGame gameName="test3"/>
            <YourGame gameName="test4"/>
        </List>
    )
}