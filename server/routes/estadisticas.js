import express from "express";
import { getEstadisticas } from "../controllers/estadisticas.js";

const router = express.Router();

router.get("/getestadisticas", getEstadisticas);

export default router;