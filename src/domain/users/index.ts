export interface IMainUser {
    name: string,
    email: string,
    password: string,
}

export interface IChangePlan {
    paidPlan: boolean, maxUsersInPlan: number
}

export type IUserToCreate = IMainUser & IChangePlan

export type IUserReturned = Omit<IUserToCreate & { id: string }, "password">