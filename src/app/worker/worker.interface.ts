export enum WorkerTaskType {
  StartStream,
  ChangeSize,
  ChangeInterval,
}

type WorkerBaseTask<WType, WPayload> = {
  type: WType;
  payload: WPayload;
};

export type StartSteamPayload = {
  dataSize?: number;
  dataInterval?: number;
};

export type WorkerStartStreamTask = WorkerBaseTask<
  WorkerTaskType.StartStream,
  StartSteamPayload
>;

export type WorkerChangeSizeTask = WorkerBaseTask<
  WorkerTaskType.ChangeSize,
  number
>;

export type WorkerChangeIntervalTask = WorkerBaseTask<
  WorkerTaskType.ChangeInterval,
  number
>;

export type WorkerTask =
  | WorkerStartStreamTask
  | WorkerChangeSizeTask
  | WorkerChangeIntervalTask;
