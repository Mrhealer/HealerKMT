var express     = require('express');
var http        = require('http');
var socket      = require('socket.io');
var bodyParser  = require('body-parser');

var app         = express();
var server      = http.Server(app);
var io          = socket(server);

//To parse URL encoded data, extended is false --> the value can be a string or array
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set("views", "views");

app.use('/', require('./routers/face'));
app.use('/api', require('./routers'));

server.listen(8881, function(){
    console.log("listen on port: 8881");
});

//listen connect form every devices want to connect 
io.on('connection', function (socket) {
    //listen socket
    socket.on('update_device', function (data) {
        console.log("realtime: " + data);
    });
    socket.on('disconnect', function () {
      io.emit('user disconnected');
    });

  });