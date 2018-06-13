import { Component, OnInit } from '@angular/core';
import { Restaurant, Product, Category} from './restaurant.model';
import { RestaurantService } from './restaurant.service';
import { error } from 'util';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  restaurants?: any;

  constructor( private restaurantService: RestaurantService ){}
  
  ngOnInit(){
    this.restaurantService.getAll().subscribe(
      data => { this.restaurants = data}, 
    err => console.error(err),
    () => console.log('restaurant loading'+ JSON.stringify(this.restaurants))
    );
    console.log("This is first call");
    console.log(JSON.stringify(this.restaurants));
  }


  
  addRestaurant(){
    
  }
  updateDB()
  {
   
    this.restaurantService.updateDB();
  }
}
