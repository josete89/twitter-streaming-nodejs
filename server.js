//Setup web server and socket
var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    params = 'API/search?method=get&brand=adidas&category=store&country=DE&format=json',
    url = 'http://placesws.adidas-group.com/',
    request = require('request-json'),
    client = request.createClient(url);


//Use the default port (for beanstalk) or default to 8081 locally
server.listen(process.env.PORT || 8081);

//Setup rotuing for app
app.use(express.static(__dirname + '/public'));

    // Create web sockets connection.
    io.on('connection', function (socket) {
        console.log('connected');
        socket.on("start stores", function(from, msg) { // Use the msg sent with start stores
            console.log('send stuff');

            client.get(params, function(err, res, body) {
                JSON.parse(body.substring(1)).wsResponse.result.forEach(function(item){
                    var outputPoint = {"lat": item.longitude_google,"lng": item.latitude_google};
                    console.log('outputPoint:', outputPoint); // Print the HTML for the Google homepage.
                    socket.emit("store", outputPoint);
                });
            });

        });

        // Emits signal to the client telling them that the
        // they are connected and can start receiving Tweets
        socket.emit("connected");
    });




