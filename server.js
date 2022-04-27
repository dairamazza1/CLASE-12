const express = require('express')
const app = express();
const fs = require('fs');
const PORT = 8080;
const { Router } = express;

app.set('view engine', 'ejs'); //se define extension (motor de plantilla)
app.use(express.static(__dirname + "/public"));
app.use(express.json()); //tiene q estar para qe se llene el req body
const urlencodedParser = app.use(express.urlencoded({extended:true}))

const { Server: HttpServer } = require('http');
const { Server:IOServer } = require('socket.io');

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const contenedor = require("./contenedor.js")


///////////////////////////////////////////////////////////////////////////////
/*
const router = Router();

app.use('/api', router);

router.get('/productos', (req,resp) => {
    const newContenedor = new contenedor('productos.txt');
    try{
            const prod = newContenedor.getAll().then( (obj) =>{     
            resp.send(obj);  
        }) 
    }catch(err){
        resp.status(500).send('No se pudieron obtener los productos')
    }   
}) 

router.get('/productos/:id', (req,resp) => {
    const newContenedor = new contenedor('productos.txt');
    try{       
        const id = parseInt(req.params.id);
        const prod = newContenedor.getByID(id).then((ret) => resp.send(ret))
    }catch(err){
        resp.status(500).send('No se encontró el producto')
    }   
}) 

router.post('/productos', urlencodedParser , (req,resp) => {
    const newContenedor = new contenedor('productos.txt');
    try{       
        const obj = {
            title: req.body.title,
            price: req.body.price,
            thumbnail: req.body.thumbnail 
        }        
        resp.send(newContenedor.save(obj));
    }catch(err){
        resp.status(500).send('No se puede cargar el producto')
    }   
}) 
*/
///////////////////////////////////////////////////////////////////////////////

app.get('/', function (req, res) {
    /*const newContenedor = new contenedor('productos.txt');
    listExists = false;
    listNotExists = false;
    
    const prod = newContenedor.getAll().then( (obj) =>{
    obj.length  > 0 ?  res.render('pages/index', {listExists: true, listProduct: obj }) : res.render('pages/index', {listNotExists: true}) ;   
    })  
   // res.sendFile(__dirname + '/public/index.html');*/
   //mandar al cliente 
    io.on('connection', (socket) => {
        listExists = false;
        listNotExists = false;
        console.log('Cliente conectado');

        const newContenedor = new contenedor('productos.txt');
        const prod = newContenedor.getAll().then( (obj) =>{  
            socket.emit('products', obj);
            obj.length  > 0 ?  res.render('pages/index', {listExists: true }) : res.render('pages/index', {listNotExists: true}) ; 
        })

        socket.on('new-products', data => {
            const newContenedor = new contenedor('productos.txt');
            const saveObj = newContenedor.save(obj).then( function getAllResults() {
                const prod = newContenedor.getAll().then( (obj) =>{
                    io.sockets.emit('products', obj);
                    obj.length  > 0 ?  res.render('pages/index', {listExists: true, listProduct: obj }) : res.render('pages/index', {listNotExists: true}) ;   

                }) 
            })
        })
    })
})
 
/*
app.post('/productos', (req, res) => {
    listExists = false;
    listNotExists = false;
    const obj = {
        title: req.body.name,
        price: req.body.price,
        thumbnail: req.body.thumbnail 
    }

    const newContenedor = new contenedor('productos.txt');

    const saveObj = newContenedor.save(obj).then( function getAllResults() {
        const prod = newContenedor.getAll().then( (obj) =>{
            obj.length  > 0 ?  res.render('pages/index', {listExists: true, listProduct: obj }) : res.render('pages/index', {listNotExists: true}) ;   
            }) 
    })
});
  */  
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const server = app.listen(PORT, () => {
    console.log("Aplicacion express escuchando en el puerto " + server.address().port);
});
