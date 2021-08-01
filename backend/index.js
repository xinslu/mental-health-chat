const app=require('express')()
var ws = require('express-ws')(app)

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>')
});

app.ws('/', (ws, req) => {
  ws.on('request', function(request) {
    console.log('in request')
    console.log(request.origin)
  })
  ws.on('message',function(message){
    console.log('in message')
    console.log(message)
  })
  console.log('websocket connection');
});

app.listen(5000, () =>
console.log('listening on http://localhost:5000/'));
