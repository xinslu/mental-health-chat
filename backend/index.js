const express = require("express");
const cors=require('cors')
const bodyParser = require('body-parser')
const dotenv=require("dotenv")
const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const connectDB = require('./database/db')
const PORT = 5000;
const http = require("http");
const socketio = require("socket.io");
const redis = require("redis");
const server = http.createServer(app);
const {registerUser}=require("./controllers/register")
const {signin}=require("./controllers/signin")
const {verify}=require('./controllers/verify')
const {logout}=require('./controllers/logout')
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

dotenv.config();
const start = async () => {
  try {
    await connectDB(process.ENV.MONGO_URI)
    server.listen(process.env.PORT || port, console.log(`Server is listening on port ${port}...`))
  } catch (error) {
    console.log(error)
  }
}


app.post('/signup',registerUser)
app.post('/login',signin)
app.get('/verify',verify)
app.get('/logout',logout)
start()


