import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxCronComponent } from './ngx-cron.component';
import { NgxCronService } from './ngx-cron.service';
import { NgxUIModule } from '@swimlane/ngx-ui';

@NgModule({
  imports: [CommonModule, FormsModule, NgxUIModule],
  providers: [NgxCronService],
  declarations: [NgxCronComponent],
  exports: [NgxCronComponent]
})
export class NgxCronModule {}
