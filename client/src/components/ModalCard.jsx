import React from "react";
import { useState } from "react";

const ModalCard = ({ productoModal, toggleModalProducto, imgUrl }) => {
  const ultimoPrecioPosition = productoModal.precio.length - 1;
  const ultimoPrecio = productoModal.precio[ultimoPrecioPosition].precio;

  const [historialToggle, setHistorialToggle] = useState(false);

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${day}/${month}/${year}`;
  };

  const historialPreciosToggle = () => {
    setHistorialToggle(!historialToggle);
  };

  const currentMonth = new Date().getMonth();
  const primerPrecioMes =
    productoModal.variacionesMensuales[
      currentMonth
    ][0].primerPrecioMes.toFixed();
  const porcentajeVariacionMensual =
    productoModal.variacionesMensuales[
      currentMonth
    ][0].porcentajeVariacionMensual.toFixed();

  const preciosUnicosPorDia = Array.from(
    new Map(
      productoModal.precio.map((item) => [
        new Date(item.fecha).toISOString().split("T")[0],
        item,
      ]),
    ).values(),
  );

  return (
    <div class="bg-black inset-0 fixed bg-opacity-30 backdrop-blur-sm flex justify-center items-center w-full h-full">
      <div class="bg-slate-100 p-6 text-lg flex justify-center flex-col fixed rounded-md z-20">
        <div class="border-gray-400 flex flex-col border-[1px] rounded h-[280px] w-[250px] flex-shrink-0 p-2">
          <h3 class="text-grey-800 font-semibold basis-[30%] text-lg line-clamp-2">
            {productoModal.titulo}
          </h3>
          <img
            src={imgUrl}
            alt=""
            class="w-[100px] h-[100px] mx-auto"
            onError={(event) => {
              event.target.src =
                "https://www.pinguino.com.ar/static/img/articulos/noDisponible.jpg";
              event.onerror = null;
            }}
          />
          <p class="text-red-600 font-bold text-xl text-center">
            ${ultimoPrecio}
          </p>
          <p class="font-semibold text-sm">
            Precio al inicio del Mes:
            <span class="text-blue-800 font-bold pl-1">${primerPrecioMes}</span>
          </p>
          <p class="font-semibold text-sm">
            Variacion Mensual:
            {porcentajeVariacionMensual}%
          </p>
        </div>
        <div class="">
          <div
            class="flex cursor-pointer"
            onClick={() => historialPreciosToggle()}
          >
            <h3 class="font-bold">Historial Precios:</h3>
            <img src="./icons8-sort-down-24.png" />
          </div>
          {historialToggle && (
            <div class="h-[200px] overflow-scroll">
              <table>
                <thead>
                  <th>Fecha</th>
                  <th>Precio</th>
                </thead>
                <tbody class="border-gray-700 border-[1px]">
                  {preciosUnicosPorDia.map((e) => (
                    <tr class="border-gray-700 border-[1px] gap-2 w-full">
                      <td class="text-xs border-gray-700 border-[1px] px-2 ">
                        {formatearFecha(e.fecha)}
                      </td>
                      <td class="text-xs border-gray-700 border-[1px] px-2">
                        ${e.precio}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <p
          onClick={() => toggleModalProducto()}
          class="text-center cursor-pointer font-bold"
        >
          Cerrar
        </p>
      </div>
    </div>
  );
};

export default ModalCard;
