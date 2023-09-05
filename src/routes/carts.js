import {
    Router
} from 'express';
import {
    cartModel
} from '../dao/models/cart.js';
import {
    productModel
} from '../dao/models/product.js';


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


router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        // console.log('Datos recibidos:', req.params);
        // console.log('Datos transformados:', cid, pid);

        // Buscar el carrito por su ID
        const cartExistente = await cartModel.findById(cid);

        // Verifica si el producto ya está en el carrito
        if (cartExistente && Array.isArray(cartExistente.arrayCart)) {
            const productoEnCarrito = cartExistente.arrayCart.find(elto => elto.product === pid);

            if (productoEnCarrito) {
                // Si ya existe, agrego 1
                productoEnCarrito.quantity += 1;
            } else {
                // Si el producto no está en el carrito, lo agrego con cantidad 1
                cartExistente.arrayCart.push({ product: pid, quantity: 1 });
            }

            // Guardar el carrito actualizado
            await cartExistente.save();

            res.status(200).json({
                result: 'success',
                message: 'Producto agregado al carrito con éxito'
            });
        } else {
            res.status(404).json({
                result: 'error',
                message: 'El carrito no existe o no tiene la propiedad "products" definida correctamente'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            result: 'error',
            message: 'Hubo un error en el servidor'
        });
    }
});


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