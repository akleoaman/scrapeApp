import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import {JsonpModule, Jsonp, Response} from '@angular/http';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { RestaurantService } from './restaurant.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    JsonpModule,
    Ng2SearchPipeModule
  ],
  providers: [RestaurantService],
  bootstrap: [AppComponent]
  
  
})
export class AppModule { }
