const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
require('dotenv').config();
const errorHandler = require("./middleware/error-handler");
const errorMessage = require("./middleware/error-message");
const accessControls = require("./middleware/access-controls");
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require("helmet");
var compression = require('compression');
// Requiring Routes

const UsersRoutes = require('./routes/users.routes');
const AdminsRoutes=require('./routes/admins.routes');
const ProductsRoutes = require('./routes/products.routes');
const StoresRoutes = require('./routes/store.routes');
const OrdersRoutes = require('./routes/orders.routes');
const ContactsRoutes=require('./routes/contacts.routes')

//Requiring Models


app.use(express.urlencoded({extended: false}));
app.use(express.json());

const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
 
 socket.on('disconnect', function(){
      io.emit('users-changed', {user: socket.username, event: 'left'});   
    });
   
    socket.on('set-name', (name) => {
      socket.username = name;
    //  io.emit('users-changed', {user: name, event: 'joined'});    
    });

    socket.on('join', (roomid) => {
      socket.join(roomid);
      console.log('user joined room->'+roomid);
      //io.emit('users-changed', {user: name, event: 'joined'});    
    });
    
    socket.on('send-message', (message) => {
      io.emit('message', {msg: message.text, user: socket.username, createdAt: new Date()});    
    });

  });

  


//bodyparser is deprecated
// app.use(bodyParser.urlencoded({extended: true}));

// app.use(bodyParser.json()); // to support JSON-encoded bodies


  
//   app.use(express.json()); // to support JSON-encoded bodies
  

// connection to mongoose
const mongoCon = process.env.mongoCon;

mongoose.connect(mongoCon,{ "useNewUrlParser": true,"useCreateIndex": true, "useUnifiedTopology": true });


const fs = require('fs');


fs.readdirSync(__dirname + "/models").forEach(function(file) {
    require(__dirname + "/models/" + file);
});
// in case you want to serve images 
app.use(express.static(path.join(__dirname, './Public')));
//app.use(express.static("public"));

app.get('/',  function (req, res) {
  res.status(200).send({
    message: 'Express backend server'});
});

//app.set('port', (3000));
app.set('port', (process.env.PORT));

app.use(accessControls);
app.use(cors());
app.use(helmet());

// compress all responses
app.use(compression())

// Routes which should handle requests
app.use("/users",UsersRoutes);
app.use("/admins",AdminsRoutes);
app.use("/stores",StoresRoutes);
// app.use("/users", userRoutes);
app.use("/products",ProductsRoutes);
app.use("/orders",OrdersRoutes);
app.use("/contacts",ContactsRoutes);


app.use(errorHandler);

app.use(errorMessage);
// ...
server.listen(app.get('port'), () => {
  console.log(`Listening on http://localhost:/`,app.get('port'));
});
// server.listen(app.get('port'));
// console.log('listening on port',app.get('port'));
