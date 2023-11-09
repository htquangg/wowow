export enum TaskStatus {
  INIT = 'INIT',
  ACTIVE = 'ACTIVE',
  TRAINING = 'TRAINING',
}

export enum ActionType {
  PREDICT = 'PREDICT',
  EXPORT = 'EXPORT',
  CREATE_DATASET = 'CREATE_DATASET',
}

export enum ActionStatus {
  INIT = 'INIT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}
