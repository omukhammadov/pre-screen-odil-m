import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { WorkerService } from './worker/worker.service';
import { TestData } from './worker/test-data.model';

const MAX_DATA_SIZE = 10;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$$ = new Subject<void>();
  private additionalIdsSubject = new BehaviorSubject<string[]>([]);

  timer = 2000;
  size = 10;
  additionalIds = '';
  dataSource$!: Observable<TestData[]>;

  constructor(private readonly workerService: WorkerService) {}

  ngOnInit(): void {
    this.workerService.startStreamOfData(this.size, this.timer);

    this.dataSource$ = this.workerService.onMessage$.pipe(
      this.limitToMaxSize(),
      this.replaceIds()
    );
  }

  onSizeChange(): void {
    this.workerService.changeSize(this.size);
  }

  onTimerChange(): void {
    this.workerService.changeInterval(this.timer);
  }

  onAdditionalIdsChange(): void {
    const ids = this.additionalIds.split(',');
    console.log('ids: ', ids);
    this.additionalIdsSubject.next(ids);
  }

  private limitToMaxSize() {
    return map<TestData[], TestData[]>((arr) =>
      arr.length > MAX_DATA_SIZE ? arr.splice(-MAX_DATA_SIZE) : arr
    );
  }

  private replaceIds() {
    return map<TestData[], TestData[]>((arr) => {
      const ids = this.additionalIdsSubject.getValue();

      if (ids.length) {
        arr.forEach((item, index) => {
          ids[index] ? (item.id = ids[index]) : null;
        });
      }

      return arr;
    });
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }
}
