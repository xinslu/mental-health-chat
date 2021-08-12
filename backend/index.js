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

io.on('disconnect', function () {
    socket.removeAllListeners()
    console.log('a user disconnected')
    socket.close()
})


io.on("connection", (socket) => {
    console.log('a user connected')
    socket.on("message", (message) => {
        console.log('in message')
        console.log(message)
        io.emit('send message', JSON.parse(message));
    });
});



server.listen(5000, () =>
    console.log('listening on http://localhost:5000/')
);
