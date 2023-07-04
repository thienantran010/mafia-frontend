import { Chip, Container, Button, ButtonGroup, Paper, ListItem, TextField} from '@mui/material';

interface createGameFormProps {
    setGameName: React.Dispatch<React.SetStateAction<string>>;
    roles: string[];
    setRoles: React.Dispatch<React.SetStateAction<string[]>>;
}
export default function CreateGameForm({ setGameName, roles, setRoles } : createGameFormProps) {
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

    interface chipData {
        key: number;
        label: string;
    }
    const chipData : chipData[] = roles.map((role, index) => {
        return {
            key: index,
            label: role
        }
    })

    const deleteChip = (data : chipData) => {
        let newRoles = [...roles];
        newRoles.splice(data.key, 1);
        setRoles(newRoles);
    }

    const handleChange : React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setGameName(event.target.value);
    }

    const addRole : React.MouseEventHandler<HTMLButtonElement> = (event) => {
        let newRoles = [...roles, (event.target as HTMLButtonElement).name].sort();
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