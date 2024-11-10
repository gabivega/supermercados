import Estadisticas from "../models/estadisticas.js";
import Productos from "../models/productos.js";

export const calcularEstadisticas = async () => {
    try {
        const currentMonth = new Date().getMonth()

        const listado = await Productos.aggregate([
            { $project: { titulo: 1, sumaVariaciones: { $arrayElemAt: ["$variacionesMensuales", currentMonth] } } },
            { $unwind: "$sumaVariaciones" },
            {
                $group: {
                    _id: null, totalVariacionMensual: { $sum: "$sumaVariaciones.porcentajeVariacionMensual" },
                    totalProductos: { $sum: 1 }
                }
            },
            { $project: { promedioInflacionMensual: { $divide: ["$totalVariacionMensual", "$totalProductos"] }, totalProductos: 1, totalVariacionMensual: 1 } }
        ]);
        console.log("Intentando actualizar estadisticas")
        await Estadisticas.updateOne({ $set: { "inflacionMensualPromedio": listado[0].promedioInflacionMensual.toFixed(2) } })
        console.log("Estadisticas Actualizadas")
    } catch (error) {
        console.log("Error, al actualizar Estadisticas, intente nuevamente", error.message)
    }
}


export const getEstadisticas = async (req, res) => {
    try {
        const estadisticas = await Estadisticas.find()
        res.status(200).json(estadisticas)
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}