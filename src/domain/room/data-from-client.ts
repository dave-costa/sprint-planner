export interface IMainClientInfo {
    roomCode: string,
    taskCode: string,
    email: string,
}


export interface IPayloadSprintFromClient {
    name: string,
    email: string,
    duration: "1" | "2" | "3" | "4",
    estimated_points?: number,
    sequence: 'fibonacciSequence' | 'tShirtSizesSequence' | 'powersOf2Sequence' | 'standardPlanningPokerSequence' | 'hoursSequence',
    tasks: { name: string, description: string }[]
}