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
  languages = NgxCronService.LANGUAGES;
  language = 'es';
  cronValidateConfigOverrides = NgxCronService.CRON_VALIDATE_CONFIG_OVERRIDES;
  allowedTimezones = NgxCronService.TIMEZONES;
  timezone = 'UTC';
}
