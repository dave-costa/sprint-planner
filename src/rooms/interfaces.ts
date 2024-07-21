export interface User {
    name: string;
    email: string;
    card: string | null;
    show: boolean;
    master: MasterInfo | null;
    sequence: string[];
    sequenceName: string;
}

export interface MasterInfo {
    email: string;
    room: string;
}

export interface Room {
    users: Record<string, User>;
}

export interface JoinRoomPayload {
    roomName?: string;
    email: string;
    username: string;
    sequence: string[] | any;
}

export interface SelectCardPayload {
    roomName: string;
    email: string;
    card: string;
}

export interface DisconnectUserPayload {
    roomName: string;
    email: string;
}

interface Task {
    id: string;
    name: string;
    description: string;
    pointsVoted: number;
    usersInRoom: any[]; // Pode ser especificado melhor se soubermos a estrutura dos usuários
    maxPontuation: number;
    minPontuation: number;
    activeUsers: number;
}

interface IRoomCreator {
    id: string;
    name: string;
    email: string;
    sequence: string;
    duration: number;
    masterInfo: any | null;
    estimated_points: number;
    tasks: Task[];
}

export interface IRooms {
    [key: string]: IRoomCreator;
}


