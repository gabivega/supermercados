import mongoose from "mongoose";

const estadisticasSchema = new mongoose.Schema({
    inflacionMensualPromedio: Number,
    inflacionMensualPorCategoria: {
        categoria: String,
        inflacionCategoria: Number
    },
},
    { timestamps: true }
)

const Estadisticas = mongoose.model("estadisticas", estadisticasSchema);
export default Estadisticas;