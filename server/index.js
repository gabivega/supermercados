import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import scrapping from "./controllers/scrapping.js";
import productsRoutes from "./routes/products.js"
import estadisticasRouter from "./routes/estadisticas.js"
import cors from "cors";
import { updateVariations } from "./functions/updateVariations.js";
import { calcularEstadisticas } from "./controllers/estadisticas.js";
import path from 'path';
import cron from "node-cron";

const app = express();
dotenv.config();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS", "PUT"],
    }),
);
const PORT = process.env.PORT || 4000;
const MONGODB = process.env.MONGODB_URL;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.use(productsRoutes, estadisticasRouter);

mongoose.set("strictQuery", false);

await mongoose.connect(MONGODB)
    .then(() => { console.log("Connected to DB") })
    .catch((error) => { console.log(error) });

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'build')));


cron.schedule("00 22 * * * ", async () => {
    await scrapping();
    await updateVariations();
    await calcularEstadisticas()
});
