import { Component, ViewEncapsulation } from '@angular/core';
import { CronService } from './modules/ngx-cron/ngx-cron.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  cron = '* * * * *';
  periods = Object.keys(CronService.PERIODS);
  allowedPeriods = Object.keys(CronService.PERIODS);
}
