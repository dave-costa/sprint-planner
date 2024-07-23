import { IPayloadSprintFromClient } from "src/domain/room/data-from-client";
import { v4 as uuid } from "uuid";

interface RelevantUserPoints {
    email: string,
    points: number
}

export interface IFormattedPayloadClientToUseInSocket {
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
    } | null;
    tasks: {
        isVoted: boolean;
        id: string;
        name: string;
        description: string;
        pointsVoted: number;
        maxPontuation: RelevantUserPoints | null;
        minPontuation: RelevantUserPoints | null;
        usersInRoom: {
            email: string,
            isMaster?: {
                roomCode: string
            },
            name: string,
            card?: string,
            show: boolean,
            sequence: string[],
            sequenceName: string
        }[];
    }[];
}
export const formatPayloadFromClient = (payloadSprint: IPayloadSprintFromClient): IFormattedPayloadClientToUseInSocket => {
    const { name, email, duration, estimated_points, tasks, sequence } = payloadSprint;
    return {
        id: uuid(),
        name: name,
        email: email,
        sequence: sequence,
        duration: Number(duration),
        masterInfo: null,
        estimated_points: Number(estimated_points),
        tasks: tasks.map((task) => {
            return {
                id: uuid(),
                name: task.name,
                description: task.description,
                pointsVoted: 0,
                isVoted: false,
                usersInRoom: [],
                maxPontuation: null,
                minPontuation: null,
                activeUsers: 0
            }
        })
    }
}