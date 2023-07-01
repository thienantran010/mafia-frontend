import { Chip, Container, Button, ButtonGroup, Paper, ListItem, TextField, Unstable_Grid2} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState } from 'react';

export default function CreateGameForm({ setGameName, roles, setRoles }) {
    const roleNames = [
        "Mafia",
        "Godfather",
        "Toaster",
        "Kami",
        "Villager",
        "Cop",
        "Creeper",
        "Doctor",
        "Bulletproof",
        "Sniper",
        "Gravedigger"
    ]

    const chipData = roles.map((role, index) => {
        return {
            key: index,
            label: role
        }
    })

    function deleteChip(data) {
        let newRoles = [...roles].toSpliced(data.key, 1);
        setRoles(newRoles);
    }

    function handleChange(event) {
        setGameName(event.target.value);
    }

    function addRole(event) {
        let newRoles = [...roles, event.target.name].sort();
        setRoles(newRoles);
    }

    const buttonComponents = roleNames.map((role) => {
        return <Button key={role} name={role} onClick={addRole}>{role}</Button>
    });

    function ChipsArray() {
        return (
            <Paper
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0.5,
                m: 0,
              }}
              component="ul"
            >
                {chipData.map((data) => {
                    return (
                    <ListItem key={data.key}>
                        <Chip
                        label={data.label}
                        onDelete={() => deleteChip(data)}
                        />
                    </ListItem>
                    );
                })}
            </Paper>
          );
    }

    return (
        <Container>
            <TextField 
                required
                name="name"
                id="name"
                label="Game Name"
                defaultValue="Fun Game!"
                onChange={handleChange} />
            <ChipsArray />
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                {buttonComponents}
            </ButtonGroup>
        </Container>
    )


}