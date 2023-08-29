export type Role = MafiaRoles | VillageRoles;

export type MafiaRoles = 
| "Kamikaze"
| "Mafia"
| "Godfather"
| "Toaster"

export type VillageRoles = 
| "Villager"
| "Sniper"
| "Gravedigger"
| "Bulletproof"
| "Cop"
| "Creeper"
| "Doctor"

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

export interface playerJson {
    playerId: string;
    isAlive: boolean;
    toastedBy: string[];
    role: Role;
    numActionsLeft: number;
    events: PlayerEvents;
}

export interface messageJson {
    username: string;
    picture?: string;
    content: string;
}

export interface action {
    dayVote?: string;
    actionVote?: string;
}

export interface actionJson {
    [username: string]: action;
}

export interface gameJson {
    id: string;
    name: string;
    players: playersJson;
    actions: actionJson[];
    library: string[][];
    allChat: messageJson[];
    mafiaChat: messageJson[];
    copChat: messageJson[];
    timeLeft: string;

    
}