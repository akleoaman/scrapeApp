
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var JSONStream = require('JSONStream');
var _ = require('underscore-node');
var through= require('through');
var hash = require('object-hash');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var path = require('path');
var cat = require('cat');
mongoose.Promise = Promise;
var cors = require('cors')


app.use(cors())
var Restaurant = require('./models/Restaurant');


// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

var dbUrl = 'mongodb://admin:admin12@ds151180.mlab.com:51180/restaurant'
var content;
io.on('connection', (socket) => {
    console.log('a user connected')
})

mongoose.connect(dbUrl, (err) => {
    console.log('mongo db connection', err)
})
var d= new Date();
var oldrestaurant;



// Get Value from JSON
//  console.log("restaurant:", jsonContent.restaurant);
//  console.log("hash:", jsonContent.hash);
//  console.log("menu:", jsonContent.menu);




function processFile() {
    // console.log(content);
}



app.get('/scrape', function(req, res, next){
    console.log("got request to scrape");
    console.log("request parameters"+ JSON.stringify(req.params));
    // The URL we will scrape from - in our example Anchorman 2.
    //url = req.url;
    //url = 'https://www.lieferheld.de/lieferservices-sulzbach-undefined/restaurant-da-antonio-kelkheim-taunus/27506/';
    urls = [
        'https://www.lieferheld.de/lieferservices-sulzbach-undefined/restaurant-da-antonio-kelkheim-taunus/27506/',
        'https://www.lieferheld.de/lieferservices-sulzbach-undefined/restaurant-casa-caloti-sulzbach/19683/',
        'https://www.lieferheld.de/lieferservices-sulzbach-undefined/restaurant-toni-liederbach-am-taunus/45202/'

     
    ];

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html
    for(var x= 0;x < urls.length; x++)  {
        url = urls[x];
        request(url, function(error, response, html)
        {

        // First we'll check to make sure no errors occurred when making the request
    
            if(!error)
            {
                console.log("No error found working after request");
                // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
    
                var $ = cheerio.load(html);
    
                // Finally, we'll define the variables we're going to capture
    
                var restaurantName,restaurantAddress, menu, category, description, item, price;
                var json = {menu: [],restaurant : "", hash :"", url: "", info: ""};
    
                json.url= url;
    
                $('.headline').filter(function() 
                {
                    var data = $(this);
                    restaurantName = data.text();
                   
                    json.restaurant= restaurantName;
                   
                    
    
                });
                json.info="";
                $('.info-page tr').each(function(row) 
                {
                    var data = $(this);
                    var rowtext = data.text()+"<br>";
                   
                   
                    json.info = json.info + rowtext;
                   
                    
    
                });
                $('.menu-section').each(function()
                {
                    var itemlist = [];
                    var data = $(this);
                     
                    category = data.children().first().text();
    
                    //console.log(category)
                    //json.category= category;
    
                    data.find('.menu-item').each(function()
                    {
                        var items = $(this);
                        item= items.find('.menu-item__description').text();
                        price= items.find('.menu-item__price').text();
                        //console.log(item + price);
                        itemlist.push({
                            product: item,
                            rate: price
                        });
                        json.price = price;
                    });
    
                    json.menu.push(
                    {
                        category: category,
                        products: itemlist
                    });
                    json.hash = hash(json.menu);
    
                    
                });
            }
            //console.log(json);

            // fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
    
            //     console.log('File successfully written! - Check your project directory for the output.json file');
            
            // });
            
            // // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
            
            // // First I want to read the file
            // fs.readFile('./output.json', function read(err, data) {
            //     if (err) {
            //         throw err;
            //     }
            //     content = data;

            //     // Invoke the next step here however you like
            //     // console.log(content);   // Put all of the code here (not the best solution)
            //     processFile();          // Or put the next step in a function and invoke it
            // });




            var content = json;
            //content = fs.readFileSync("output.json");
            //console.log("read content"+content);
           
                var jsonContent = content;
                //console.log(jsonContent);

                
                io.on('connection', (socket) => {
                    console.log('a user connected')
                })
                
                mongoose.connect(dbUrl, (err) => {
                    console.log('mongo db connection', err)
                })
            var restaurant = new Restaurant(jsonContent)
            Restaurant.findOne({restaurant: jsonContent.restaurant}, function(err,oldrestaurant){
              if(oldrestaurant)
              {
                if(oldrestaurant.hash !== restaurant.hash) 
                {
                  oldrestaurant.updateOne({ menu: restaurant.menu },{hash: restaurant.hash}, function(err, res) {
                      // Updated at most one doc, `res.modifiedCount` contains the number
                      // of docs that MongoDB updated
                      console.log("updated the restaurant menu and hash")
                    });
                    
                }
              }else  {
                    console.log("found no match. save the restaurant");
                restaurant.save()
                .then(() => 
                {
                    console.log('Scraped Restaurant saved')
                    return Restaurant.findOne({restaurant: jsonContent.restaurant})
                })
        
                .catch((err) =>
                {
                    res.sendStatus(500)
                    return console.error(err)
                });

                }
               

            }
        );
            

         /*   if(oldrestaurant.restaurant == restaurant.restaurant)
            {
                console.log("found atleast one match");
                var oldrestaurant = Restaurant.findOne({restaurant: jsonContent.restaurant});
                if(oldrestaurant && oldrestaurant.hash == restaurant.hash)
                {
                    console.log("hashes are matching no need to update menu");
                   // return next(new Error([error]));
                   oldrestaurant.updateOne({ menu: jsonContent.menu },{hash: jsonContent.hash}, function(err, res) {
                    // Updated at most one doc, `res.modifiedCount` contains the number
                    // of docs that MongoDB updated
                    console.log("updated the restaurant menu and hash")
                  });

                }else {
                    console.log("hashes are not matching please update restaurant menu");
                    // restaurant.save()
                    // .then(() => 
                    // {
                    //     console.log('Scraped Restaurant saved')
                    //     return Restaurant.findOne({restaurant: jsonContent.restaurant})
                    // })
            
                    // .catch((err) =>
                    // {
                    //     res.sendStatus(500)
                    //     return console.error(err)
                    // });
                }
            }else{
                console.log("found no match. save the restaurant");
                restaurant.save()
                .then(() => 
                {
                    console.log('Scraped Restaurant saved')
                    return Restaurant.findOne({restaurant: jsonContent.restaurant})
                })
        
                .catch((err) =>
                {
                    res.sendStatus(500)
                    return console.error(err)
                });

            }
    
               
                
*/
            
            
        });



    }
    res.send('scraped!')
});
    
      


    


        //adding routes 
var restRoute = require('./routes/restaurant');
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/restaurants', express.static(path.join(__dirname, 'dist')));
app.use('/restaurants', restRoute);

var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.minute = 20;
var j = schedule.scheduleJob(rule, function(){
  console.log('The answer to life, the universe, and everything!');
  request('http://localhost:8081/scrape', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log("call by scheduler");
  
});
});

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app; 

