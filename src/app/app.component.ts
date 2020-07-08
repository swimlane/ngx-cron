/* tslint:disable: template-no-call-expression */
import { Component, ViewEncapsulation } from '@angular/core';
import { NgxCronService } from 'projects/swimlane/ngx-cron/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  cron = '* * * * *';
  periods = Object.keys(NgxCronService.PERIODS);
  allowedPeriods = Object.keys(NgxCronService.PERIODS);
}
