import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { baseUrl } from "../utils/baseUrl";

const Estadisticas = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [estadisticas, setEstadisticas] = useState(null);
  const [subaProductos, setSubaProductos] = useState([]);
  const [bajaProductos, setBajaProductos] = useState([]);

  const obtenerEstadisticas = async () => {
    setIsLoading(true);
    const req = await fetch(`${baseUrl}/getestadisticas`, {
      method: "GET",
      headers: { "content-type": "application/JSON" },
    });
    const estadisticas = await req.json();
    setEstadisticas(estadisticas);
    setIsLoading(false);
    return estadisticas;
  };

  const getProductosSuba = async () => {
    const productsRequest = await fetch(`${baseUrl}/products?page=1`, {
      method: "GET",
      headers: { "content-type": "application/json" },
    });
    setIsLoading(false);
    const products = await productsRequest.json();
    setSubaProductos(products);
  };

  const getBajaProductos = async () => {
    const request = await fetch(`${baseUrl}/bajaproductos?page=1`, {
      method: "GET",
      headers: { "content-type": "application/json" },
    });
    const bajaProductos = await request.json();
    setBajaProductos(bajaProductos);
    setIsLoading(false);
  };
  const currentMonth = new Date().getMonth();

  useEffect(() => {
    obtenerEstadisticas();
    getProductosSuba();
    getBajaProductos();
  }, []);

  return (
    <div class="w-full ">
      <h1 class="text-2xl font-semibold text-red-700 text-center underline">
        Estadisticas
      </h1>
      <div>{isLoading && <Spinner />}</div>
      <div class="p-4 border-b-2 border-gray-500">
        {estadisticas && (
          <>
            {estadisticas.map((e) => (
              <h2 class="font-bold text-xl text-center text-blue-950">
                Inflación Mensual: {e.inflacionMensualPromedio}%
              </h2>
            ))}
          </>
        )}
      </div>
      <div class="flex flex-col sm:flex-row gap-8 flex-wrap mx-auto justify-center">
        <div class="sm:w-[40%]">
          {subaProductos && (
            <>
              <h1 class="text-lg font-semibold text-orange-800 p-2 text-center">
                PRODUCTOS CON MAYOR SUBA:
              </h1>
              <div>
                {subaProductos.map((producto) => (
                  <div class="flex border-gray-600 border-[1px] border-b-2 justify-between p-2">
                    <p class="text-l font-semibold">{producto.titulo} </p>
                    <p class="font-bold text-red-700">
                      {producto.variaciones.porcentajeVariacionMensual}%
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div class="sm:w-[40%]">
          {bajaProductos && (
            <>
              <h1 class="text-lg font-semibold text-green-800 p-2 text-center">
                PRODUCTOS CON MAYOR BAJA:
              </h1>
              <div>
                {bajaProductos.map((producto) => (
                  <div class="flex border-gray-600 border-[1px] border-b-2 justify-between p-2">
                    <p class="text-l font-semibold">{producto.titulo} </p>
                    <p class="font-bold text-green-700">
                      {
                        producto.variacionesMensuales[currentMonth][0]
                          .porcentajeVariacionMensual
                      }
                      %
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
