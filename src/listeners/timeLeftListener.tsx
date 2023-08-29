import { Socket } from "socket.io-client";
import { gameJson, actionJson } from "../types/gameTypes";

export default function ListenToTimeLeftChange(socket : Socket, setGame :  React.Dispatch<React.SetStateAction<gameJson | undefined>>) {
    
    const handleUpdate = (timeLeft : string) => {
        setGame((game) => {
            if (game) {
                const updatedGame = {...game, timeLeft};
                return updatedGame;
            }
        })
    }
    socket.on(`timeLeft`, handleUpdate)
}