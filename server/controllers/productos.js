import Productos from "../models/productos.js";

export const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page)
        const limit = 24;
        const skip = (page - 1) * limit
        const listadoProductos = await Productos.aggregate([
            {
                $match: {
                    "variaciones.variacionMensual": { $gt: 0 }
                }
            },
            {
                $sort: {
                    "variaciones.porcentajeVariacionMensual": -1
                }
            },
            {
                $project: {
                    titulo: 1,
                    precio: 1,
                    codigo: 1,
                    proveedor: 1,
                    precioHace7Dias: 1,
                    variaciones: 1,
                    variacionesMensuales: 1,
                }
            },
            {
                $facet: {
                    "pagination":
                        [
                            { $skip: skip },
                            { $limit: limit }
                        ]

                }
            },
        ])
        res.status(200).json(listadoProductos[0].pagination);

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}


export const getBajaProductos = async (req, res) => {
    try {
        const page = parseInt(req.query.page)
        const limit = 24;
        const skip = (page - 1) * limit
        const listadoProductos = await Productos.aggregate([
            {
                $match: {
                    "variaciones.variacionMensual": { $lt: 0 }
                }
            },
            {
                $sort: {
                    "variaciones.porcentajeVariacionMensual": 1
                }
            },
            {
                $project: {
                    titulo: 1,
                    precio: 1,
                    codigo: 1,
                    proveedor: 1,
                    precioHace7Dias: 1,
                    variaciones: 1,
                    variacionesMensuales: 1,
                }
            },
            {
                $facet: {
                    "pagination":
                        [
                            { $skip: skip },
                            { $limit: limit }
                        ]

                }
            },
        ])
        res.status(200).json(listadoProductos[0].pagination);

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export const listadoGeneral = async (req, res) => {
    try {
        const products = await Productos.aggregate([
            {
                $sort: {
                    "titulo": 1
                }
            },
            {
                $project: {
                    titulo: 1,
                    ultimoPrecio: {
                        $let: {
                            vars: { ultimoPrecioObj: { $arrayElemAt: ["$precio", -1] } },
                            in: "$$ultimoPrecioObj.precio"
                        }
                    },
                    categoria: 1,
                }
            }
        ]);
        res.status(200).json(products)

    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const getProductoListado = async (req, res) => {

    try {
        const _id = req.query.id;
        const producto = await Productos.findOne({ _id })
        res.status(200).json(producto)

    } catch (error) {
        console.log("Something went wrong. Error :", error.message)
    }
}