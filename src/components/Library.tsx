import { List, ListItem, Container, Typography, ListItemText } from "@mui/material";
import { ReactNode } from "react";

function LibraryEntry({ entry, phase } : {entry: string[], phase: string}) {
    return (
            <ListItem key={phase}>
                <ListItemText 
                    primary={phase}
                    secondary={entry.map((sentence, index) => <ListItem key={index}><Typography>{sentence}</Typography></ListItem>)}/>
            </ListItem>
    );
}

export default function Library( {library } : {library : string[][]} ) {

    const libraryEntries : ReactNode[] = []
    
    for (const [index, entry] of library.entries()) {
        if (index % 2 === 0) {
            const phase = `Night ${index / 2}`;
            libraryEntries.push(<LibraryEntry entry={entry} phase={phase} />);
        }

        else if (index % 2 === 1) {
            const phase = `Day ${Math.ceil(index / 2)}`;
            libraryEntries.push(<LibraryEntry entry={entry} phase={phase} />);
        }
    }
    return (
            <List sx={{maxHeight: '80vh'}}>
                {libraryEntries}
            </List>
    )
}