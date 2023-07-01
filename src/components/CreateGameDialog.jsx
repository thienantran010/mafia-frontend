import { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import CreateGameForm from './CreateGameForm';
import { useAuth } from '../providers/AuthProvider';

export default function CreateGameDialog() {
    const [open, setOpen] = useState(false);
    const [gameName, setGameName] = useState("");
    const [roles, setRoles] = useState([]);
    const {accessToken, setAccessToken} = useAuth();

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    async function handleCreate () {
      handleClose();
      try {
        const options = {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              name: gameName,
              roles: roles
            })
        }
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/createOpenGame`, options);
      }
      catch (error) {
        console.log(error);
      }
    }
  
    return (
    <div>
        <Button variant="outlined" onClick={handleClickOpen}>
        Create Game
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Create Game</DialogTitle>
          <DialogContentText>
          </DialogContentText>
          <DialogContent>
              <CreateGameForm setGameName={setGameName} setRoles={setRoles} roles={roles} />
          </DialogContent>
          <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleCreate}>Create</Button>
          </DialogActions>
        </Dialog>
    </div>
    );
}