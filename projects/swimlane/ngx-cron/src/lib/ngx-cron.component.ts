import {
  Component,
  ViewEncapsulation,
  OnChanges,
  Input,
  EventEmitter,
  Output,
  HostBinding,
  SimpleChanges
} from '@angular/core';

import { NgxCronService, ICronData, Period, Weekday, Month } from './ngx-cron.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ngx-cron-input',
  templateUrl: './ngx-cron.component.html',
  styleUrls: ['./ngx-cron.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NgxCronComponent implements OnChanges {
  @Input()
  set cron(val: string) {
    this.setCron(val);
    this._cron = val;
    this.cronChange.emit(this._cron);
  }
  get cron(): string {
    return this._cron;
  }

  @Input()
  allowedPeriods = NgxCronService.PERIODKEYS;

  @Input()
  allowQuartz = true;

  @HostBinding('attr.disabled')
  @Input()
  get disabled() {
    return this._disabled ? true : null;
  }
  set disabled(val) {
    this._disabled = val;
  }

  periods = NgxCronService.PERIODKEYS;
  dows = NgxCronService.DOWS;
  months = NgxCronService.MONTHS;
  predefined = NgxCronService.PERIODS;

  cronData: ICronData = {
    description: this.cronService.toString('0 * * * *'),
    period: Period.Custom,
    valid: true,
    seconds: 0,
    secondInterval: 1,
    minute: 0,
    minuteInterval: 1,
    weekday: 'Sunday',
    day: 1,
    month: 'January',
    time: NgxCronService.MIDNIGHT,
    isQuartz: false,
    daysMax: 31
  };

  @HostBinding('class.invalid')
  invalid = false;

  @Output() cronChange: EventEmitter<any> = new EventEmitter();

  get description() {
    return this.cronData.description;
  }

  // tslint:disable-next-line: variable-name
  _allowedPeriods: Period[] = NgxCronService.PERIODKEYS;

  disableCustomInput = false;

  // tslint:disable-next-line: variable-name
  private _cron = '0 * * * *';
  // tslint:disable-next-line: variable-name
  private _disabled = false;

  constructor(public cronService: NgxCronService) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('allowedPeriods' in changes || 'allowQuartz' in changes) {
      this._allowedPeriods = this.allowedPeriods.filter(k => {
        const i = this.periods.indexOf(k);
        if (i < 0) {
          return false;
        }
        if (!this.allowQuartz && this.predefined[k].quartz) {
          return false;
        }
        return true;
      }) as Period[];

      // if current period no missing, pick first
      if (this.cronData.period !== Period.Custom && !(this._allowedPeriods.indexOf(this.cronData.period) > -1)) {
        this.cronData.period = this._allowedPeriods[0];
        this._cron = this.getCron();
        this.setDescription(this._cron);
      }

      this.disableCustomInput = this._allowedPeriods.indexOf(Period.Custom) < 0;
    }
  }

  cronDataChanged() {
    this.cronData.time = this.cronData.time || NgxCronService.MIDNIGHT;
    this._cron = this.getCron();
    this.setDescription(this._cron);
    this.cronChange.emit(this._cron);
  }

  private setDescription(cron: string) {
    const c = this.cronService.getCronData(cron);

    if (this.cronData.period !== 'Custom') {
      this.cronData.period = c.period;
    }

    if (c.isQuartz && !this.allowQuartz) {
      c.valid = false;
      c.description = 'Quartz not allowed';
    }

    this.cronData.description = c.description;
    this.cronData.valid = c.valid;
    this.cronData.daysMax = c.daysMax || this.cronData.daysMax;

    this.invalid = !c.valid;
  }

  /**
   * Set the component state based on the cron
   */
  private setCron(cron: string) {
    const data = this.cronService.getCronData(cron);
    if (this.cronData.period !== 'Custom') {
      this.cronData.period = data.period;
    }

    if (data.isQuartz && !this.allowQuartz) {
      data.valid = false;
      data.description = 'Quartz not allowed';
    }

    // copy only defined to local state
    for (const key of Object.keys(data)) {
      if (data[key] !== undefined && data[key] !== null) {
        this.cronData[key] = data[key];
      }
    }

    this.invalid = !data.valid;
  }

  /**
   * Get the cron string from component state
   * Only used for non-custome periods
   */
  private getCron(): string {
    return this.cronService.getCronFromCronData({
      ...this.cronData,
      expression: this.cron
    });
  }
}
