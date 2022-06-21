var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
}); //require socket.io module and pass the http object (server)
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED1 = new Gpio(4, 'out'); //use GPIO pin 4 as output VERDE 1
var LED2 = new Gpio(17, 'out'); //use GPIO pin 17 as output AMARILLO 1
var LED3 = new Gpio(18, 'out'); //use GPIO pin 18 as output ROJO 1
var LED4 = new Gpio(27, 'out'); //use GPIO pin 27 as output VERDE 2
var LED5 = new Gpio(22, 'out'); //use GPIO pin 22 as output AMARILLO 2
var LED6 = new Gpio(23, 'out'); //use GPIO pin 23 as output ROJO 2
var pushButton = new Gpio(24, 'in', 'both'); //use GPIO pin 24 as input, and 'both' button presses, and releases should be handled

http.listen(8080); //listen to port 8080

function handler (req, res) { //create server
  fs.readFile(__dirname + '/public/index.html', function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
}

io.sockets.on('connection', function (socket) {// WebSocket Connection
  socket.on('verde1',function(data){
    LED1.writeSync(data);
  });
  socket.on('amarillo1',function(data){
    LED2.writeSync(data);
  });
  socket.on('rojo1',function(data){
    LED3.writeSync(data);
  });
  socket.on('rojo11',function(data){
    LED3.writeSync(data);
  });
  
  socket.on('verde2',function(data){
    LED4.writeSync(data);
  });
  socket.on('amarillo2',function(data){
    LED5.writeSync(data);
  });
  socket.on('rojo2',function(data){
    LED6.writeSync(data);
  });
  socket.on('rojo22',function(data){
    LED6.writeSync(data);
  });
});

process.on('SIGINT', function () { //on ctrl+c
  LED1.writeSync(0); // Turn LED off
  LED1.unexport(); // Unexport LED GPIO to free resources
  LED2.writeSync(0); // Turn LED off
  LED2.unexport(); // Unexport LED GPIO to free resources
  LED3.writeSync(0); // Turn LED off
  LED3.unexport(); // Unexport LED GPIO to free resources
  LED4.writeSync(0); // Turn LED off
  LED4.unexport(); // Unexport LED GPIO to free resources
  LED5.writeSync(0); // Turn LED off
  LED5.unexport(); // Unexport LED GPIO to free resources
  LED6.writeSync(0); // Turn LED off
  LED6.unexport(); // Unexport LED GPIO to free resources
  pushButton.unexport(); // Unexport Button GPIO to free resources
  process.exit(); //exit completely
});
