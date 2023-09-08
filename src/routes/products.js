import {
    Router
} from 'express';
import {
    productModel
} from '../dao/models/product.js';
import mongoose from 'mongoose';

const router = Router();

// ESTO FUNCIONABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
// router.get('/limited', async (req, res) => {
//     try {
//         console.log('Datos recibidos:', req.query.limit);
//         const cantLimit = parseInt(req.query.limit); // Obtén el valor del parámetro "limit" como número

//         if (isNaN(cantLimit) || cantLimit <= 0) {
//             return res.status(400).json({
//                 result: 'error',
//                 message: 'El parámetro "limit" no es un número válido o es menor o igual a cero'
//             });
//         }

//         const productos = await productModel.find().limit(cantLimit);

//         res.status(200).json({
//             result: 'success',
//             payload: productos
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             result: 'error',
//             message: 'Hubo un error en el servidor'
//         });
//     }
// });

// router.get('/all', async (req, res) => {
//     try {
//         let productos = await productModel.find();
//         res.send({
//             result: 'sucess',
//             payload: productos
//         });

//     } catch (error) {
//         console.log(error);
//     }

// })
// ESTO FUNCIONABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
///http://localhost:8080/api/products?limit=4&page=1&sort=asc
router.get('/', async (req, res) => {
    try {
        const {
            limit = 10, page = 1, query, sort
        } = req.query;

        // Parsea limit y page a números
        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);

        // Verifica si limit y page son números válidos
        if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedLimit <= 0 || parsedPage <= 0) {
            return res.status(400).json({
                result: 'error',
                message: 'Los parámetros "limit" y "page" deben ser números válidos y mayores que cero'
            });
        }

        // Construye el objeto de opciones de búsqueda basado en los parámetros
        const options = {
            limit: parsedLimit,
            page: parsedPage,
        };

        // Aplica el filtro si se proporciona el parámetro "query"
        if (query) {
            options.query = {
                /* Define aquí tu filtro en función de "query" */ };
        }

        // Aplica la ordenación si se proporciona el parámetro "sort"
        if (sort) {
            if (sort === 'asc') {
                options.sort = {
                    price: 1
                }; // Ascendente
            } else if (sort === 'desc') {
                options.sort = {
                    price: -1
                }; // Descendente
            } 
            // else {
            //     return res.status(400).json({
            //         result: 'error',
            //         message: 'El parámetro "sort" debe ser "asc" o "desc"'
            //     });
            // }
        }


        // Realiza la búsqueda en la base de datos con las opciones construidas
        const productos = await productModel.paginate({}, options);

        res.status(200).json({
            result: 'success',
            payload: productos,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            result: 'error',
            message: 'Hubo un error en el servidor',
        });
    }
});



router.get('/:pid', async (req, res) => {
    const {
        pid
    } = req.params;
    try {
        console.log('Datos recibidos:', pid);
        const producto = await productModel.findById(pid);

        if (!producto) {
            return res.status(404).json({
                result: 'error',
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            result: 'success',
            payload: producto
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            result: 'error',
            message: 'Hubo un error en el servidor'
        });
    }
});


router.post('/', async (req, res) => {

    try {
        let {
            title,
            description,
            price,
            category,
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
            category,
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