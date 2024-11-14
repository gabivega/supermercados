import Productos from "../models/productos.js";

export const updateVariations = async () => {
    try {
        const variaciones = await Productos.aggregate([

            { $project: { _id: 1, titulo: 1, precio: 1, categoria: 1, codigo: 1, variaciones: 1 } }
        ])

        for (let i = 0; i < variaciones.length; i++) {

            const ultimaMedicion = variaciones[i].precio.slice(-1);
            const ultimoPrecio = ultimaMedicion[0].precio;
            const ultimaFecha = ultimaMedicion[0].fecha
            const mesActual = new Date().getMonth()
            const arrayOfDates = [[], [], [], [], [], [], [], [], [], [], [], []]
            for (let j = 0; j < variaciones[i].precio.length; j++) {
                const splittedFecha = new Date(variaciones[i].precio[j].fecha).toISOString().split("T")[0];
                const currentMonth = variaciones[i].precio[j].fecha.getMonth();
                arrayOfDates[currentMonth].push([splittedFecha, variaciones[i].precio[j].precio]);
            }

            const uniqueArrayOfDates = arrayOfDates.map(monthData =>
                Array.from(new Map(monthData.map(([fecha, precio]) => [fecha, precio])).entries())
            );

            let arrayOfVariations = [[], [], [], [], [], [], [], [], [], [], [], []]
            for (let h = 0; h < 12; h++) {
                if (uniqueArrayOfDates[h].length == 1) {
                    const primerPrecioMes = uniqueArrayOfDates[h][0][1];
                    const ultimoPrecioMes = uniqueArrayOfDates[h][0][1];
                    const variacionMensual = 0
                    const porcentajeVariacionMensual = 0

                    const variacionMensualObject = {
                        "primerPrecioMes": primerPrecioMes,
                        "ultimoPrecioMes": ultimoPrecioMes,
                        "variacionMensual": 0,
                        "porcentajeVariacionMensual": 0
                    }
                    arrayOfVariations[h].push(variacionMensualObject)
                }
                if (uniqueArrayOfDates[h].length > 1) {
                    const primerPrecioMes = uniqueArrayOfDates[h][0][1];
                    const ultimoPrecioMes = uniqueArrayOfDates[h].slice(-1)[0][1];
                    const variacionMensual = ultimoPrecioMes - primerPrecioMes;
                    const porcentajeVariacionMensual = (((variacionMensual) / primerPrecioMes) * 100).toFixed(2)

                    const variacionMensualObject = {
                        "primerPrecioMes": primerPrecioMes,
                        "ultimoPrecioMes": ultimoPrecioMes,
                        "variacionMensual": variacionMensual,
                        "porcentajeVariacionMensual": Number(porcentajeVariacionMensual)
                    }
                    arrayOfVariations[h].push(variacionMensualObject)
                }
            }
            if (variaciones[i].variaciones == undefined) {
                variaciones[i].variaciones = {};
            }
            variaciones[i].variacionesMensuales = arrayOfVariations;
            if (arrayOfVariations[mesActual].length > 0) {
                variaciones[i].variaciones.porcentajeVariacionMensual = arrayOfVariations[mesActual][0].porcentajeVariacionMensual;
            }
            else {
                variaciones[i].variaciones.porcentajeVariacionMensual = 0
            }
        }

        const operacion = variaciones.map((item) => (
            {
                updateOne: {

                    filter: { _id: item._id },
                    update: {
                        $set: {
                            'variacionesMensuales': item.variacionesMensuales,
                            'variaciones.variacionMensual': item.variaciones.porcentajeVariacionMensual
                        },
                    },
                    upsert: true,
                },
            }));

        const saveInDb = async () => {
            for (let a = 0; a <= 5; a++) {
                try {

                    console.log("Intentando actualizar las variaciones en la BD...")
                    await Productos.bulkWrite(operacion);
                    console.log("Variaciones Actualizadas correctamente");
                    break;
                } catch (error) {
                    console.error(`Error al intentar guardar (intento ${a}):`, error.message);
                    if (a === 5) {
                        console.error("Número máximo de intentos alcanzado. No se pudo guardar.");
                    }
                    else {
                        await new Promise(resolve => setTimeout(resolve, 2000))
                    }
                }
            }
        };
        saveInDb();
    }
    catch (error) {
        console.log(error)
    }

}
