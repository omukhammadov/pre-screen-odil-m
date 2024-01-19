import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
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

  timer = 2000;
  size = 10;
  dataSource$!: Observable<TestData[]>;

  constructor(private readonly workerService: WorkerService) {}

  ngOnInit(): void {
    this.workerService.startStreamOfData(this.size, this.timer);

    this.dataSource$ = this.workerService.onMessage$.pipe(
      map((arr) =>
        arr.length > MAX_DATA_SIZE ? arr.splice(-MAX_DATA_SIZE) : arr
      )
    );
  }

  onSizeChange(): void {
    this.workerService.changeSize(this.size);
  }

  onTimerChange(): void {
    this.workerService.changeInterval(this.timer);
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }
}
