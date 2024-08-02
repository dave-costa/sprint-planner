// src/domain/sprints/index.ts
export interface ITask {
  name: string;
  description?: string;
  voted: boolean;
  pointsVoted?: number;
}

export interface ISprintToCreate {
  name: string;
  durationWeeks: number;
  sequencie: string;
  estimatedPoints?: number;
  ownerID: string;
  tasks: ITask[];
}

export interface ISprintReturned {
  id: string;
  name: string;
  durationWeeks: number;
  sequencie: string;
  realPoints?: number;
  estimatedPoints?: number;
  ownerID: string;
  tasks: ITask[];
}

export interface IParticipant {
  tasksNames: string;
  tasksIds: string;
  phone: string | null;
  email: string;
  points: number;
  userId?: string;
  sprintId: string;
  taskId: string;
}

export interface IUpdateRealPoints {
  sprintId: string;
  realPoints: number;
}
