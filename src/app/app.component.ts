import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { WorkerService } from './worker/worker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$$ = new Subject<void>();
  title = 'pre-screen-odil-m';
  timer = 5000;
  size = 10;

  constructor(private readonly workerService: WorkerService) {}

  ngOnInit(): void {
    this.workerService.startStreamOfData(this.size, this.timer);

    this.workerService.onMessage$
      .pipe(takeUntil(this.destroy$$))
      .subscribe((message) => {});
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
