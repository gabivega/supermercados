import express from "express";
import { getBajaProductos, getProducts, listadoGeneral, getProductoListado } from "../controllers/productos.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/bajaproductos", getBajaProductos);
router.get("/listadogeneral", listadoGeneral)
router.get("/productolistado", getProductoListado)
export default router;

