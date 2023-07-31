import { Socket } from "socket.io-client";
import { gameJson, actionJson } from "../types/gameTypes";

export default function ListenToPhaseChange(socket : Socket, gameId : string, setGame :  React.Dispatch<React.SetStateAction<gameJson | undefined>>) {

    const handleUpdate = (updatedFields : actionJson) => {
        setGame((game) => {
            if (game && game.actions) {
                const currentActions = game.actions[game.actions.length - 1];
                let updatedActions = {}
                for (const username in updatedFields) {
                    updatedActions = {...currentActions, [username]: {...currentActions[username], ...updatedFields[username]}}
                }

                const newActions = game.actions.map((actions, index) => {
                    if (index === game.actions.length - 1) {
                        return updatedActions;
                    }
                    
                    else {
                        return actions;
                    }
                });

                const updatedGame : gameJson = {...game, actions: newActions}
                return updatedGame;
            }
        })
    }
    socket.on(`actions`, handleUpdate)
}