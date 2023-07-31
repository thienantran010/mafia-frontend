import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { DialogContentText, Button, DialogActions } from '@mui/material';

interface SimpleDialogProps {
  openDialog: boolean;
  title: string;
  text: string;
  setOpenDialog: (openDialog : boolean) => void;
}

export default function SimpleDialog({ openDialog, setOpenDialog, title, text, } : SimpleDialogProps) {

  const handleClose = () => {
    setOpenDialog(false);
  }

  return (
    <div>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}