import {
  Component, ViewEncapsulation, OnChanges,
  Input, EventEmitter, Output, HostBinding,
  SimpleChanges
} from '@angular/core';

import { CronService } from './ngx-cron.service';

@Component({
  selector: 'ngx-cron-input',
  templateUrl: './ngx-cron.component.html',
  styleUrls: [ './ngx-cron.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class NgxCronComponent {
  @Input()
  set cron(val: string) {
    this.setCron(val);
    this._cron = val;
  }
  get cron(): string {
    return this._cron;
  }

  @Input()
  allowedPeriods = Object.keys(CronService.PERIODS);

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

  periods = Object.keys(CronService.PERIODS);
  dows = CronService.DOWS;
  months = CronService.MONTHS;
  predefined = CronService.PERIODS;

  period = this.periods[0];
  seconds = 0;
  secondInterval = 1;
  min = 0;
  minInterval = 1;
  dow = this.dows[0];
  day = 1;
  month = this.months[0];
  time = CronService.MIDNIGHT;
  description: string = this.cronService.toString('0 * * * *');

  daysMax = 31;

  @HostBinding('class.invalid')
  invalid = false;

  @Output() cronChange: EventEmitter<any> = new EventEmitter();

  protected _allowedPeriods = Object.keys(CronService.PERIODS);

  private _cron = '0 * * * *';
  private _disabled = false;

  constructor(public cronService: CronService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('allowedPeriods' in changes || 'allowQuartz' in changes) {
      this._allowedPeriods = this.allowedPeriods.filter(k => {
        const i = this.periods.indexOf(k);
        if (i < 0) { return false; }
        if (!this.allowQuartz && this.predefined[k].quartz) { return false; }
        return true;
      });
      
      // if current period no missing, pick first
      if (!(this._allowedPeriods.indexOf(this.period) > -1)) {
        this.period = this._allowedPeriods[0];
        this._cron = this.getCron();
        this.setDescription(this._cron);
      }
    }
  }

  changed() {
    this._cron = this.getCron();
    this.setDescription(this._cron);
    this.cronChange.emit(this._cron);
  }

  private setDescription(cron: string) {
    const c = this.cronService.getCronData(cron);

    if (this.period !== 'Custom') {
      this.period = c.period;
    }

    if (c.isQuartz && !this.allowQuartz) {
      c.valid = false;
      c.description = 'Quartz not allowed';
    }

    this.description = c.description;
    this.invalid = !c.valid;
    this.daysMax = c.daysMax || this.daysMax;
  }

  /**
   * Set the component state based on the cron
   */
  private setCron(cron: string) {
    const data = this.cronService.getCronData(cron);
    if (this.period !== 'Custom') {
      this.period = data.period;
    }

    if (data.isQuartz && !this.allowQuartz) {
      data.valid = false;
      data.description = 'Quartz not allowed';
    }

    // copy only defined to local state
    Object.assign(this, data);
  }

  /**
   * Get the cron string from component state
   * Only used for non-custome periods
   */
  private getCron(): string {
    return this.cronService.getCronFromCronData(this);
  }
}
