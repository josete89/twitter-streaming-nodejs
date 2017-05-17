//Setup web server and socket
var twitter = require('twitter'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    params = 'API/search?brand=adidas&geoengine=google&method=get&category=store&latlng=33.791056165773554,-118.33751519475203,20000&page=2&pagesize=500&fields=name,street1,street2,addressline,buildingname,postal_code,city,state,store_owner,country,storetype,longitude_google,latitude_google,store_owner,state,performance,brand_store,factory_outlet,originals,neo_label,y3,slvr,children,woman,footwear,football,basketball,outdoor,porsche_design,miadidas,miteam,stella_mccartney,eyewear,micoach,opening_ceremony&format=json&storetype=',
    url = 'http://placesws.adidas-group.com/',
    request = require('request-json'),
    client = request.createClient(url);


//Setup twitter stream api
var twit = new twitter({
  consumer_key: 'kYrwSBOb4ngCYYtlo2iwlj1OG',
  consumer_secret: 'WW4B1nOxLUtQaxD7M6KDrnwyEbM6Zr3fs9yUUVgvhRP5g7vu40',
  access_token_key: '195474036-W8z05QRiw5StnPjwvDDlkiPXvj3JokEKYbOYUHLm',
  access_token_secret: 'IhS7MT8DvtR9oS6tBchEdUU9ryiOMXAV5nboNRF6iURdu'
}),
stream = null;

//Use the default port (for beanstalk) or default to 8081 locally
server.listen(process.env.PORT || 8081);

//Setup rotuing for app
app.use(express.static(__dirname + '/public'));


    // Create web sockets connection.
    io.sockets.on('connection', function (socket) {

        socket.on("start stores", function() {
            client.get(params, function(err, res, body) {
                body.wsResponse.result.forEach(function(){
                    var outputPoint = {"lng": this.longitude_google,"lat": this.latitude_google};
                    console.log('outputPoint:', outputPoint); // Print the HTML for the Google homepage.
                    // socket.broadcast.emit("store", outputPoint);
                // return console.log(body.rows[0].title);
                });
            });
        });

        // Emits signal to the client telling them that the
        // they are connected and can start receiving Tweets
        socket.emit("connected");
    });




