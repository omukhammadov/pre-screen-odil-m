import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import {
  WorkerChangeIntervalTask,
  WorkerChangeSizeTask,
  WorkerStartStreamTask,
  WorkerTask,
  WorkerTaskType,
} from './worker.interface';
import { TestData } from '../models/test-data.model';

@Injectable({ providedIn: 'root' })
export class WorkerService {
  private _worker!: Worker;
  private readonly _onMessageSubject = new BehaviorSubject<TestData[]>([]);

  constructor() {
    this.initWorker();
  }

  startStreamOfData(size?: number, interval?: number): void {
    const task: WorkerStartStreamTask = {
      type: WorkerTaskType.StartStream,
      payload: {
        dataSize: size,
        dataInterval: interval,
      },
    };

    this.postMessage(task);
  }

  getStreamOfData(): Observable<TestData[]> {
    return this._onMessageSubject.pipe(
      map((arr) => arr.map((item) => new TestData(item)))
    );
  }

  changeSize(size: number): void {
    const task: WorkerChangeSizeTask = {
      type: WorkerTaskType.ChangeSize,
      payload: size,
    };

    this.postMessage(task);
  }

  changeInterval(interval: number): void {
    const task: WorkerChangeIntervalTask = {
      type: WorkerTaskType.ChangeInterval,
      payload: interval,
    };

    this.postMessage(task);
  }

  private postMessage(task: WorkerTask): void {
    this._worker.postMessage(task);
  }

  private initWorker(): void {
    this._worker = new Worker(new URL('./worker', import.meta.url));
    this._worker.onmessage = ({ data }) => {
      console.log('Page received a message: ', data);
      this._onMessageSubject.next(data);
    };
  }
}
