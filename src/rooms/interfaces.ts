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
