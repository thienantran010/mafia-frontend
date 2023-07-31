import { Role } from "./gameTypes";

export interface activeGameListItem {
    id: string;
    name: string;
}

export interface playersJson {
    [username : string] : {
        playerId: string;
        isAlive: boolean;
        role: Role;
        numActionsLeft: number;
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
    library: string[];
    messages: messageJson[];
}