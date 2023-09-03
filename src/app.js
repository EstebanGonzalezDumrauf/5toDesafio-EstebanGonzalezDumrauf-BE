import express from 'express';
import __dirName from './utils.js';
import path from 'path'; // Importa el módulo path
import handlebars from 'express-handlebars';
import userRouter from './routes/products.js';
import viewsRouter from './routes/views.js';
import mongoose from 'mongoose';
import { Server } from "socket.io";

const app = express();
const port = 8080;

app.engine('handlebars', handlebars.engine());
//app.set('views', __dirName, '/views');
app.set('views', path.join(__dirName, 'views'));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.static(__dirName + '/public'));
app.use(express.urlencoded({ extended: true }));

app.use('/', viewsRouter);

app.use('/api/products', userRouter);

mongoose.connect('mongodb+srv://estebangonzalezd:coder1234@clusterestebangonzalezd.wuhulk1.mongodb.net/Ecommerce');

const server = app.listen(port, () => {
    console.log(`Server ON en puerto ${port}`);
});

const io = new Server(server); 

let messages = [];
io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('message', data => {
        messages.push(data);
        io.emit('messageLogs', messages);
    })

    socket.on('authenticated', data => {
        socket.broadcast.emit('newUserConnected', data);
    })
})