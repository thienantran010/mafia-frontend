import { Socket } from "socket.io-client";
import { gameJson, actionJson } from "../types/gameTypes";

export default function ListenToLibraryChange(socket : Socket, setGame :  React.Dispatch<React.SetStateAction<gameJson | undefined>>) {

    const handleUpdate = (newLibraryEntry : string []) => {
        setGame((game) => {
            if (game) {
                const newLibrary = [...game.library, newLibraryEntry];
                const updatedGame = {...game, library: newLibrary};
                return updatedGame;
            }
        })
    }
    socket.on(`library`, handleUpdate)
}