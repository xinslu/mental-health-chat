const express = require("express");
const cors=require('cors')
const app = express();
app.use(cors())
const PORT = 5000;
const http = require("http");
const bodyParser = require('body-parser')
const socketio = require("socket.io");
const redis = require("redis");
const server = http.createServer(app);
const io = socketio(server).listen(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST']
    }
});
const client = redis.createClient({host: process.env.REDIS_HOST || '127.0.0.1', port: 6379});

client.on("error", function(error) {
      console.error(error);
});

client.on("ready", ()=>{
      console.error("Connected to Redis");
});


// app.ws('/', (ws, req) => {
//   console.log('websocket connection');
//   ws.on('request', function(request) {
//     console.log('in request')
//     console.log(request.origin)
//   })
//   ws.on('message',function(message){
//     client.on("error", function(error) {
//       console.error(error);
//     });
//     console.log(message)
//   })
//   console.log('sending to client')
//   ws.send(request)
//   client.on("error", function(error) {
//     console.error(error);
//   });
// });

io.on("connection", (socket) => {
    console.log('a user connected')
    socket.on("message", (message) => {
        console.log(message)
        io.emit('message', message);
    });
});

app.get("/chat", (req, res) => {
    const username = req.query.username;
    io.emit("joined", username);
});


server.listen(5000, () =>
    console.log('listening on http://localhost:5000/')
);
