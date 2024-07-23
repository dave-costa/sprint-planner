interface RelevantUserPoints {
    email: string,
    points: number
}
export interface IUserInRoom {
    email: string,
    isMaster?: {
        roomCode: string
    },
    name: string,
    card?: string,
    show: boolean,
    sequence: string[],
    sequenceName: string
}
export interface IFormattedRoom {
    id: string;
    name: string;
    email: string
    duration: number;
    estimated_points: number;
    sequence: string;
    masterInfo: {

        email: string
        room: string
        sequence: string
        ;
    } | null;
    tasks: {
        id: string;
        name: string;
        description: string;
        pointsVoted: number;
        maxPontuation: RelevantUserPoints | null;
        minPontuation: RelevantUserPoints | null;
        isVoted: boolean;
        usersInRoom: IUserInRoom[];
    }[];
}
export interface IRoom {
    [key: string]: IFormattedRoom
}
