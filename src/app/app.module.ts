import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { NgxCronModule } from 'projects/swimlane/ngx-cron/src/public-api';
import { NgxUIModule } from '@swimlane/ngx-ui';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [BrowserModule, BrowserAnimationsModule, NgxCronModule, NgxUIModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {}
