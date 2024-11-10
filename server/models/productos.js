import mongoose from "mongoose";

const productosSchema = new mongoose.Schema({
    proveedor: { type: String, required: true },
    codigo: String,
    titulo: { type: String, required: true },
    precio: [
        {
            _id: false,
            precio: { type: Number, required: true },
            fecha: { type: Date, default: Date.now }
        }
    ],
    variaciones: {
        _id: false,
        precioHace7Dias: Number,
        variacionSemanal: Number,
        porcentajeVariacionSemanal: Number,
        precioMensual: Number,
        variacionMensual: Number,
        porcentajeVariacionMensual: Number,
    },
    variacionesMensuales: Array,
    imagenUrl: String,
    categoria: String,
},
    { timestamps: true });

const Productos = mongoose.model("Productos", productosSchema);
export default Productos