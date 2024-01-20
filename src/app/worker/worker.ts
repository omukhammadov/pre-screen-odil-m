/// <reference lib="webworker" />

import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  distinctUntilChanged,
  interval,
  of,
  switchMap,
  takeUntil,
} from 'rxjs';
import { TestData } from '../models/test-data.model';
import { StartSteamPayload, WorkerTaskType } from './worker.interface';

const DEFAULT_SIZE = 10;
const DEFAULT_INTERVAL = 300;

const sizeSubject = new BehaviorSubject<number>(DEFAULT_SIZE);
const intervalSubject = new BehaviorSubject<number>(DEFAULT_INTERVAL);
const intervalChangedSubject = new Subject<void>();

addEventListener('message', ({ data }) => {
  console.log('Worker received a message: ', data);

  const { type, payload } = data;

  if (type == null || payload == null) {
    console.log("Worker says: can't do nothing with this data.");
    return;
  }

  switch (type) {
    case WorkerTaskType.StartStream:
      streamData(payload);
      break;

    case WorkerTaskType.ChangeSize:
      changeSize(payload);
      break;

    case WorkerTaskType.ChangeInterval:
      changeInterval(payload);
      break;

    default:
      break;
  }
});

function streamData({ dataSize, dataInterval }: StartSteamPayload) {
  if (dataSize) {
    changeSize(dataSize);
  }

  if (dataInterval) {
    changeInterval(dataInterval);
  }

  combineLatest([sizeSubject.asObservable(), intervalSubject.asObservable()])
    .pipe(
      distinctUntilChanged(),
      switchMap(([dataSize, dataInterval]) =>
        interval(dataInterval).pipe(
          takeUntil(intervalChangedSubject.asObservable()),
          switchMap(() => getDataStreamOfSize(dataSize))
        )
      )
    )
    .subscribe((data) => postMessage(data));
}

function changeSize(size: number): void {
  sizeSubject.next(size);
}

function changeInterval(interval: number): void {
  intervalChangedSubject.next();
  intervalSubject.next(interval);
}

function getDataStreamOfSize(size: number): Observable<TestData[]> {
  let testData: TestData[] = [];

  for (let i = 0; i < size; i++) {
    const data = new TestData();
    testData.push(data);
  }

  // Mock an HTTP request
  return of(testData);
}
