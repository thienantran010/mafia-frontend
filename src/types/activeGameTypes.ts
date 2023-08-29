import { Role } from "./gameTypes";

export interface activeGameListItem {
    id: string;
    name: string;
}

export interface PlayerEvents {
    [index : string] : string[];
}

export interface playersJson {
    [username : string] : {
        playerId: string;
        isAlive: boolean;
        toastedBy: string[];
        role: Role;
        numActionsLeft: number;
        events: PlayerEvents;
    }
}

export interface messageJson {
    username: string;
    picture?: string;
    signature?: string;
    content: string;
}

export interface action {
    dayVote?: string;
    actionVote?: string;
}

export interface actionJson {
    [username: string]: action;
}

export interface activeGameJson {
    id: string;
    name: string;
    players: playersJson;
    actions: actionJson[];
    library: string[][];
    allChat: messageJson[];
    mafiaChat: messageJson[];
    copChat: messageJson[];
    nextPhase: string;
}