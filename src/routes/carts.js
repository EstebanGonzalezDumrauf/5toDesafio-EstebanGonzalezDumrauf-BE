import {
    Router
} from 'express';
import {
    cartModel
} from '../dao/models/cart.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        let carrito = await cartModel.find();
        res.send({
            result: 'sucess',
            payload: carrito
        });
    } catch (error) {
        console.log(error);
    }
})

router.post('/', async (req, res) => {
    try {
        let {
            arrayCart
        } = req.body;

        console.log('Datos recibidos:', req.body);

        let result = await cartModel.create({
            arrayCart
        });

        res.send({
            result: 'sucess',
            payload: result
        });
    } catch (error) {
        res.send({
            status: "Error",
            error: 'Se produjo un error fatal'
        });
    }

})

router.put('/:cid', async (req, res) => {
    try {
        let arrayCart = req.body;
        let {
            cid
        } = req.params;

        console.log('Datos recibidos:', req.body);

        let result = await cartModel.updateOne({
            _id: cid
        }, arrayCart);

        res.send({
            result: 'sucess',
            payload: result
        });
    } catch (error) {
        res.send({
            status: "Error",
            error: 'Se produjo un error fatal'
        });
    }

})

router.delete('/:pid', async (req, res) => {

    let {
        pid
    } = req.params;

    let result = await cartModel.deleteOne({
        _id: pid
    });

    res.send({
        result: 'sucess',
        payload: result
    });
})

export default router;