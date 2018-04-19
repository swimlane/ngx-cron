import { Component, ViewEncapsulation } from '@angular/core';
import { CronParser } from './modules/ngx-cron/cron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  cron = '* * * * *';
  periods = Object.keys(CronParser.PERIODS);
  allowedPeriods = Object.keys(CronParser.PERIODS);
}
