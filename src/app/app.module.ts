import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxCronModule } from './modules/ngx-cron/ngx-cron.module';
import { NgxUIModule } from '@swimlane/ngx-ui';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxCronModule,
    NgxUIModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
