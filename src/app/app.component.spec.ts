import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { WorkerService } from './worker/worker.service';
import { EMPTY, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let workerServiceStub: jasmine.SpyObj<WorkerService>;

  describe('DOM tests', () => {
    beforeEach(async () => {
      workerServiceStub = jasmine.createSpyObj('WorkerService', [
        'startStreamOfData',
        'getStreamOfData',
        'changeSize',
        'changeInterval',
      ]);

      await TestBed.configureTestingModule({
        declarations: [AppComponent],
        imports: [FormsModule],
        providers: [{ provide: WorkerService, useValue: workerServiceStub }],
      }).compileComponents();

      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;

      // Ensure it doesn't error out on ngOnInit()
      workerServiceStub.getStreamOfData.and.returnValue(EMPTY);
      fixture.detectChanges();
    });

    it('should change interval on timer input change', () => {
      // Arrange

      const timerDe = fixture.debugElement.query(By.css('#timer'));
      const timerEl = timerDe.nativeElement as HTMLInputElement;
      const timerLabelEl = fixture.nativeElement.querySelector(
        'label[for="timer"]'
      ) as HTMLLabelElement;

      // Act
      const timerValue = 1000;
      timerEl.value = timerValue.toString(); // set any value in ms
      component.timer = timerValue; // HACK: ngModel won't update it for some reason
      timerDe.triggerEventHandler('change');

      // Assert
      fixture.detectChanges();
      expect(workerServiceStub.changeInterval).toHaveBeenCalledOnceWith(
        timerValue
      );
      expect(timerDe.attributes['type']).toBe('number');
      expect(timerLabelEl.textContent).toBe('Timer, ms');
    });

    it('should change size on size input change', () => {
      // Assert
      const sizeDe = fixture.debugElement.query(By.css('#size'));
      const sizeEl = sizeDe.nativeElement as HTMLInputElement;
      const sizeLabelEl = fixture.nativeElement.querySelector(
        'label[for="size"]'
      ) as HTMLLabelElement;

      // Act
      const size = 20;
      sizeEl.value = size.toString();
      component.size = size;
      sizeDe.triggerEventHandler('change');

      // Assert
      fixture.detectChanges();
      expect(workerServiceStub.changeSize).toHaveBeenCalledOnceWith(size);
      expect(sizeDe.attributes['type']).toBe('number');
      expect(sizeLabelEl.textContent).toBe('Array size');
    });
  });

  describe('Class tests', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent],
        providers: [{ provide: WorkerService, useValue: workerServiceStub }],
      });

      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
    });

    it('should create component', () => {
      expect(component).toBeTruthy();
    });
  });

  // it(`should have as title 'pre-screen-odil-m'`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.componentInstance;
  //   expect(app.title).toEqual('pre-screen-odil-m');
  // });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('.content span')?.textContent).toContain('pre-screen-odil-m app is running!');
  // });
});
