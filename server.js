var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const axios = require('axios');
const fs = require('fs');

app.get("/", function(req, res){
    res.sendFile(__dirname + '/public/index.html');
})

io.on('connection', function(socket){
    console.log('a user is connected');
    socket.on('disconnect', function (){
        console.log('a user is disconnected');
    })
    socket.on('chat message', function (msg){
        console.log('message recu : ' + msg);
        io.emit('chat message', msg);
    })

})

http.listen(3000, function(){
    console.log("Server running on 3000")
})

app.get("/get-data", function(req, res) {
    axios.get("https://api.scaleway.com/instance/v1/zones/fr-par-1/products/servers")
        .then(response => {
            fs.writeFileSync("data.xml", JSON.stringify(response.data));
            res.send("Data saved to data.xml");
        })
        .catch(error => {
            console.log(error);
            res.send(error);
        });
});