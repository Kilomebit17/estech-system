import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import {AppComponent} from './app.component';
import {TokenInterceptor} from "./shared/token.interceptor";
import {appRoutes, AppRoutingModule} from "./app-routing.module";
import { HistoryListComponent } from './pages/history-page/history-list/history-list.component';
import { HistoryFilterComponent } from './pages/history-page/history-filter/history-filter.component';



@NgModule({
  declarations: [
    AppComponent,
    appRoutes,
    HistoryListComponent,
    HistoryFilterComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    multi: true,
    useClass: TokenInterceptor

  }],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
