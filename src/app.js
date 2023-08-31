import express from 'express';
import userRouter from './routes/products.js'
import mongoose from 'mongoose';

const app = express();
const port = 8080;

app.use(express.json());
//app.use(express.static(__dirName + '/public'));
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', userRouter);

mongoose.connect('mongodb+srv://estebangonzalezd:coder1234@clusterestebangonzalezd.wuhulk1.mongodb.net/shiningEcommerce');

const server = app.listen(port, () => {
    console.log(`Server ON en puerto ${port}`);
});