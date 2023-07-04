export interface playerObj {
    id: string;
    username: string;
}

export interface openGame {
    numPlayersJoined: number;
    numPlayersMax: number;
    name: string;
    roles: string[];
    playerObjs: playerObj[];
    id: string;
    isInGame: boolean;
}