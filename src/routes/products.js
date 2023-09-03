import {
    Router
} from 'express';
import {
    productModel
} from '../dao/models/product.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        let productos = await productModel.find();
        res.send({
            result: 'sucess',
            payload: productos
        });

    } catch (error) {
        console.log(error);
    }

})

router.post('/', async (req, res) => {

    try {
        let {
            title,
            description,
            price,
            status,
            thumbnail,
            code,
            stock
        } = req.body;

        if (!title || !code) {
            return res.send({
                status: "Error",
                error: 'Datos incompletos'
            });
        }

        let result = await productModel.create({
            title,
            description,
            price,
            status,
            thumbnail,
            code,
            stock
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

router.put('/:pid', async (req, res) => {

    let datosAUpdate = req.body;
    let {
        pid
    } = req.params;

    // if (!datosAUpdate.title || !datosAUpdate.code) {
    //     return res.send({
    //         status: "Error",
    //         error: 'Datos incompletos'
    //     });
    // }

    let result = await productModel.updateOne({
        _id: pid
    }, datosAUpdate);

    res.send({
        result: 'sucess',
        payload: result
    });
})

router.delete('/:pid', async (req, res) => {

    let {
        pid
    } = req.params;

    let result = await productModel.deleteOne({
        _id: pid
    });

    res.send({
        result: 'sucess',
        payload: result
    });
})

export default router;