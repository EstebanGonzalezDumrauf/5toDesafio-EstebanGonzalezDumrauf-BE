import {
    Router
} from 'express';
import {
    productModel
} from '../dao/models/product.js';

const router = Router();

router.get('/products', async (req, res) => {
    const {
        page = 1
    } = req.query;

    const {
        docs,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage
    } = await productModel.paginate({}, {
        limit: 5,
        page
    })

    const prevLink = hasPrevPage ? `/products?page=${prevPage}` : null;
    const nextLink = hasNextPage ? `/products?page=${nextPage}` : null;


    res.render('index', {
        docs,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        prevLink,
        nextLink
    });
})

router.get('/api/products/:pid', async (req, res) => {
    try {
        //console.log('Datos recibidos:', pid);
        const productId = req.params.pid;
        const producto = await productModel.findById(productId);

        const productoLimpiado = {
            title: producto.title,
            description: producto.description,
            price: producto.price,
            thumbnail: producto.thumbnail,
        };

        if (!producto) {
            return res.status(404).json({
                result: 'error',
                message: 'Producto no encontrado'
            });
        }

        res.render('detail', {
            product: productoLimpiado ,
            cartUrl: '/cart'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            result: 'error',
            message: 'Hubo un error en el servidor',
        });
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const carrito = await cartModel.findById(cid);
        res.render('cart', {
            cartProducts: carrito.arrayCart // Pasamos solo la matriz de productos
        });
    } catch (error) {
        console.log(error);
    }
})

export default router;