import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxCronComponent } from './ngx-cron.component';
import { NgxUIModule } from '@swimlane/ngx-ui';

@NgModule({
  imports: [
    CommonModule,
    NgxUIModule
  ],
  declarations: [NgxCronComponent],
  exports: [NgxCronComponent]
})
export class NgxCronModule { }
