import { Socket } from "socket.io-client";
import { messageJson, gameJson } from "../types/gameTypes";

export default function ListentToMessagesChange(socket : Socket, setGame :  React.Dispatch<React.SetStateAction<gameJson | undefined>>) {

    const handleUpdate = (chatType: string, message : messageJson) => {
        setGame((game) => {
            if (game) {

                if (chatType === 'allChat') {
                    const updatedChat = [...game.allChat, message];
                    const updatedGame : gameJson = {...game, allChat: updatedChat};
                    return updatedGame;
                }

                else if (chatType === 'mafiaChat') {
                    const updatedChat = [...game.mafiaChat, message];
                    const updatedGame : gameJson = {...game, mafiaChat: updatedChat};
                    return updatedGame;
                }

                else if (chatType === 'copChat') {
                    const updatedChat = [...game.copChat, message];
                    const updatedGame : gameJson = {...game, copChat: updatedChat};
                    return updatedGame;
                }
            }
        })
    }
    socket.on(`chat`, handleUpdate)
}