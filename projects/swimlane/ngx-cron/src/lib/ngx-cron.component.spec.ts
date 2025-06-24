import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxCronComponent } from './ngx-cron.component';
import { NgxUIModule } from '@swimlane/ngx-ui';
import { NgxCronService } from './ngx-cron.service';

describe('NgxCronComponent', () => {
  let component: NgxCronComponent;
  let fixture: ComponentFixture<NgxCronComponent>;
  let selections: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxUIModule, NoopAnimationsModule],
      declarations: [NgxCronComponent],
      providers: [{ provide: NgxCronService, useClass: NgxCronService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxCronComponent);
    component = fixture.componentInstance;
    component.cron = '* * * * *';
    selections = fixture.nativeElement.querySelector('.selections');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should as Minutely', () => {
    expect(selections.textContent).toContain('Every');
    expect(selections.textContent).toContain('minute');
    expect(component.description).toBe('Every minute');
  });

  it('should do hourly', () => {
    component.cron = '0 * * * *';
    fixture.detectChanges();
    expect(selections.textContent).toContain('At');
    expect(selections.textContent).toContain('minutes');
    expect(selections.textContent).toContain('past the hour');
    expect(component.description).toBe('Every hour');
  });

  it('should do daily', () => {
    component.cron = '0 0 * * *';
    fixture.detectChanges();
    expect(selections.textContent).toContain('At');
    expect(component.description).toBe('At 12:00 AM');
  });

  it('should do weekly', () => {
    component.cron = '0 0 * * 0';
    fixture.detectChanges();
    expect(selections.textContent).toContain('At');
    expect(selections.textContent).toContain(', only on');
    expect(component.description).toBe('At 12:00 AM, only on Sunday');
  });

  it('should do monthly', () => {
    component.cron = '0 0 1 * *';
    fixture.detectChanges();
    expect(selections.textContent).toContain('At');
    expect(selections.textContent).toContain('on day');
    expect(selections.textContent).toContain('of the month');
    expect(component.description).toBe('At 12:00 AM, on day 1 of the month');
  });

  it('should do yearly', () => {
    component.cron = '0 0 1 1 *';
    fixture.detectChanges();
    expect(selections.textContent).toContain('At');
    expect(selections.textContent).toContain('on day');
    expect(selections.textContent).toContain('of the month');
    expect(selections.textContent).toContain(', only in');
    expect(component.description).toContain('At 12:00 AM, on day 1 of the month, only in January');
  });

  it('should do secondly', () => {
    component.cron = '* * * * * *';
    fixture.detectChanges();
    expect(selections.textContent).toContain('Every');
    expect(selections.textContent).toContain('second');
    expect(component.description).toContain('Every second');
  });

  it('should do custom', () => {
    component.cron = '*/4 * * 30 * *';
    fixture.detectChanges();
    expect(selections.textContent).toContain('Every 4 seconds, on day 30 of the month');
    expect(component.description).toContain('Every 4 seconds, on day 30 of the month');
  });

  it('should detect invalidad minutes', () => {
    component.cron = '100 * * * *';
    fixture.detectChanges();
    expect(selections.textContent).toContain(
      "Number 100 of minutes field is bigger than upper limit '59' (Input cron: '100 * * * *')"
    );
    expect(component.description).toContain(
      "Number 100 of minutes field is bigger than upper limit '59' (Input cron: '100 * * * *')"
    );
  });

  it('should detect invalidad cron', () => {
    component.cron = 'd m y m s';
    fixture.detectChanges();
    expect(selections.textContent).toContain("Element 'd of minutes field is invalid. (Input cron: 'd m y m s')");
    expect(component.description).toContain("Element 'd of minutes field is invalid. (Input cron: 'd m y m s')");
  });

  it('should show description in spanish', () => {
    component.language = 'es';
    component.cron = '0 * * * *';
    fixture.detectChanges();
    expect(selections.textContent).toContain('At');
    expect(selections.textContent).toContain('minutes past the hour');
    expect(component.description).toContain('Cada hora');
  });

  it('should display the provided time value', () => {
    component.cron = '15 0 1 * *';
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    expect(component.description).toBe('At 12:15 AM, on day 1 of the month');
    expect(component.time).toBe('12:15 AM');
    expect(selections.textContent).toContain('At');
    expect(selections.textContent).toContain('on day');
    expect(selections.textContent).toContain('of the month');
  });
});
