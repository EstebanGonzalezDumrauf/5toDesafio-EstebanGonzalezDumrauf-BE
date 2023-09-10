import express from 'express';
import __dirName from './utils.js';
import path from 'path'; // Importa el módulo path
import handlebars from 'express-handlebars';
import productRouter from './routes/products.js';
import cartRouter from './routes/carts.js'
import viewsRouter from './routes/views.js';
import mongoose from 'mongoose';
import {
    Server
} from "socket.io";
import {
    chatModel
} from './dao/models/chat.js';

const app = express();
const port = 8080;

app.engine('handlebars', handlebars.engine());
//app.set('views', __dirName, '/views');
app.set('views', path.join(__dirName, 'views'));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.static(__dirName + '/public'));
app.use(express.urlencoded({
    extended: true
}));

app.use('/', viewsRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

const environment = async () => {
    await mongoose.connect('mongodb+srv://estebangonzalezd:coder1234@clusterestebangonzalezd.wuhulk1.mongodb.net/Ecommerce');
}
//mongoose.connect('mongodb+srv://estebangonzalezd:coder1234@clusterestebangonzalezd.wuhulk1.mongodb.net/Ecommerce');
environment();

app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({
        status: "Error",
        error: 'Se produjo un error inesperado'
    });
});


const server = app.listen(port, () => {
    console.log(`Server ON en puerto ${port}`);
});

const io = new Server(server);

let messages = [];
io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('message', async data => {
        messages.push(data);

        try {
            const {
                user,
                message
            } = data;
            const chatMessage = new chatModel({
                user,
                message
            });

            //Se persiste en Mongo
            const result = await chatMessage.save();

            console.log(`Mensaje de ${user} persistido en la base de datos.`);
        } catch (error) {
            console.error('Error al persistir el mensaje:', error);
        }

        io.emit('messageLogs', messages);
    })

    socket.on('authenticated', data => {
        socket.broadcast.emit('newUserConnected', data);
    })

})