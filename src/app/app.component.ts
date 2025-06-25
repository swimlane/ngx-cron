import { Component, ViewEncapsulation } from '@angular/core';

import moment from 'moment-timezone';

import { NgxCronService } from 'projects/swimlane/ngx-cron/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class AppComponent {
  cron = '* * * * *';
  periods = Object.keys(NgxCronService.PERIODS);
  allowedPeriods = Object.keys(NgxCronService.PERIODS);

  languages = [
    { name: 'English', value: 'en' },
    { name: 'Spanish', value: 'es' },
    { name: 'Catalan', value: 'ca' },
    { name: 'Czech', value: 'cs' },
    { name: 'Danish', value: 'da' },
    { name: 'German', value: 'de' },
    { name: 'Finnish', value: 'fi' },
    { name: 'Farsi', value: 'fa' },
    { name: 'Hebrew', value: 'he' },
    { name: 'Italian', value: 'it' },
    { name: 'Japanese', value: 'ja' },
    { name: 'Korean', value: 'ko' },
    { name: 'Norwegian', value: 'nb' },
    { name: 'Dutch', value: 'nl' },
    { name: 'Polish', value: 'pl' },
    { name: 'Portuguese Brazil', value: 'pt_BR' },
    { name: 'Romanian', value: 'ro' },
    { name: 'Russian', value: 'ru' },
    { name: 'Slovakian', value: 'sk' },
    { name: 'Sloveanian', value: 'sl' },
    { name: 'Swahili', value: 'sw' },
    { name: 'Swedish', value: 'sv' },
    { name: 'Turkish', value: 'tr' },
    { name: 'Ukranian', value: 'uk' },
    { name: 'Chinese (Simplified)', value: 'zh_CN' },
    { name: 'Chinese (Traditional)', value: 'zh_TW' }
  ];

  language = 'en';
  cronValidateConfigOverrides = NgxCronService.CRON_VALIDATE_CONFIG_OVERRIDES;
  allowedTimezones = moment.tz.names();
  timezone = '';
}
