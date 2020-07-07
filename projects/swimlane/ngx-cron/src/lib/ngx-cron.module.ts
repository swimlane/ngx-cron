import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxCronComponent } from './ngx-cron.component';
import { NgxCronService } from './ngx-cron.service';
import { NgxUIModule } from '@swimlane/ngx-ui';

@NgModule({
  imports: [CommonModule, NgxUIModule],
  providers: [NgxCronService],
  declarations: [NgxCronComponent],
  exports: [NgxCronComponent],
})
export class NgxCronModule {}
