import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { NgxCronModule } from 'projects/swimlane/ngx-cron/src/public-api';
import { NgxUIModule } from '@swimlane/ngx-ui';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, NgxCronModule, NgxUIModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
