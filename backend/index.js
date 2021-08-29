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
    socket.close()
})


io.on("connection", (socket) => {
    socket.on("message", (message) => {
        JSONmessage=JSON.parse(message)
        io.emit('send message', JSONmessage);
        client.zadd("chat",JSONmessage.time,message);
        client.zremrangebyscore("chat", Date.now()-21600000,Date.now()-21599999)
    });
    socket.on("get message", ()=>{
        client.zrange(["chat", "0", "-1"],function(rangeError, rangeResponse) {
            if (rangeError) throw rangeError;
            rangeResponse.map((chatMessage)=>socket.emit("send message",JSON.parse(chatMessage)))
        });
    })
});





server.listen(5000, () =>
    console.log('listening on http://localhost:5000/')
);
