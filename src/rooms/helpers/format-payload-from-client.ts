import { IPayloadSprintFromClient } from "../schemas/room";
import { v4 as uuid } from "uuid";


export interface IFormattedPayloadClientToUseInSocket {
    id: string;
    name: string;
    email: string
    duration: number;
    estimated_points: number;
    sequence: string;
    masterInfo: any;
    tasks: {
        id: string;
        name: string;
        description: string;
        pointsVoted: number;
        maxPontuation: number;
        minPontuation: number;
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
                usersInRoom: [],
                maxPontuation: 0,
                minPontuation: 0,
                activeUsers: 0
            }
        })
    }
}