const express = require('express')
const app = express();
const fs = require('fs');
const PORT = 8080;

app.set('view engine', 'ejs'); //se define extension (motor de plantilla)
app.use(express.static(__dirname + "/public"));
app.use(express.json()); //tiene q estar para qe se llene el req body
const urlencodedParser = app.use(express.urlencoded({extended:true}))

const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const contenedor = require("./contenedor.js")
const newContenedor = new contenedor('productos.txt');
const chat = new contenedor('chat.txt');

//mandar al cliente 
io.on('connection', (socket) => {
    const prod = newContenedor.getAll().then( (obj) =>{  
        socket.emit('products', obj);
    })

    socket.on('new-products', data => {
        const saveObj = newContenedor.save(data).then( function getAllResults() {
            const prod = newContenedor.getAll().then( (obj) =>{
                io.sockets.emit('products', obj);
            }) 
        })
    })
})

io.on('connection', (socket) => {
    const text = chat.getAll().then( (obj) =>{  
        socket.emit('text', obj);
    })
    socket.on('new-text', data => {
        const saveObj = chat.save(data).then( function getAllResults() {
            const text = chat.getAll().then( (obj) =>{
                io.sockets.emit('text', obj);
            }) 
        })
    })
})

app.get('/', function (req, res) {
    listExists = false;
    listNotExists = false;
    
    const prod = newContenedor.getAll().then( (obj) =>{
        //obj.length  > 0 ?  res.render('/pages/index' , {listExists: true, listProduct: obj }) : res.render('pages/index', {listNotExists: true}) ;   
        obj.length  > 0 ?  res.render('pages/index', {listExists: true }) : res.render('pages/index', {listNotExists: true}) ;
    })  
})
 
const connectedServer = httpServer.listen(PORT, () =>{
    console.log('Servidor escuchando en el puerto '+ connectedServer.address().port);
})
connectedServer.on('error', error => console.log('Error en el servidor ' + error))