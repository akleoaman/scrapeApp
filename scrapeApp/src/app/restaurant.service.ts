import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {JsonpModule, Jsonp, Response} from '@angular/http';
import { Restaurant, Product, Category} from './restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  url: string = "http://localhost:8081/restaurants/";

  serverUrl: string = "http://localhost:8081/scrape";

  constructor(private http: HttpClient, private jsonp: Jsonp) { }
    


  getAll(){
    return this.http.get(this.url);
  }

  delete(id){
      this.http.delete(this.url+id);
  }

  create(restaurant: Restaurant){
      this.http.post(this.url,restaurant);
      
  }

  update(restaurant: Restaurant){
    this.http.post(this.url,restaurant);
  }

  add(pizza: String){
    this.http.post(this.serverUrl,{url: pizza})
  }

updateDB()
{
  alert('update data');
  //this.http.get(this.serverUrl);
  this.jsonp.request(this.serverUrl);
}

}
