import { Socket } from "socket.io-client";
import { gameJson, playersJson } from "../types/gameTypes";

export default function ListenToPlayersChange(socket : Socket, setGame :  React.Dispatch<React.SetStateAction<gameJson | undefined>>) {

    const handleUpdate = (updatedPlayers : playersJson) => {
        console.log("reached handleUpdatePlayers");
        setGame((game) => {
            if (game) {
                console.log("players");
                const updatedGame = {...game, players: updatedPlayers};
                return updatedGame;
            }
        })
    }
    socket.on(`players`, handleUpdate)
}