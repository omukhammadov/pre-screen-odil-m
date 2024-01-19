import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WorkerService } from './worker/worker.service';
import { TestData } from './worker/test-data.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$$ = new Subject<void>();
  title = 'pre-screen-odil-m';
  timer = 2000;
  size = 10;

  dataSource$!: Observable<TestData[]>;

  constructor(private readonly workerService: WorkerService) {}

  ngOnInit(): void {
    this.workerService.startStreamOfData(this.size, this.timer);

    this.dataSource$ = this.workerService.onMessage$;
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
