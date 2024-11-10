import Productos from "../models/productos.js";

export const guardarEnBd = async (data) => {
    try {
        const operacion = data.map((item) => (
            {
                updateOne: {
                    filter: { codigo: item.codigo },
                    update: {
                        $set: {
                            titulo: item.titulo,
                            codigo: item.codigo,
                            imagenUrl: item.imagenUrl,
                            categoria: item.categoria,
                            proveedor: item.proveedor,
                        },
                        $push: { precio: { precio: item.precio, fecha: new Date() } }
                    },
                    upsert: true,
                },
            }));
        await Productos.bulkWrite(operacion);
        console.log("Datos guardados correctamente");
    } catch (error) {
        console.error("Error al guardar los datos en la base de datos:", error);
    }
};
