import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxCronComponent } from './ngx-cron.component';

describe('NgxCronComponent', () => {
  let component: NgxCronComponent;
  let fixture: ComponentFixture<NgxCronComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxCronComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxCronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
