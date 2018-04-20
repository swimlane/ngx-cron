import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxCronComponent } from './ngx-cron.component';
import { CronService } from './ngx-cron.service';
import { NgxUIModule } from '@swimlane/ngx-ui';

@NgModule({
  imports: [
    CommonModule,
    NgxUIModule
  ],
  providers: [CronService],
  declarations: [NgxCronComponent],
  exports: [NgxCronComponent]
})
export class NgxCronModule { }
