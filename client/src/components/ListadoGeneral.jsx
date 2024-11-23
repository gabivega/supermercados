import React from "react";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import ModalCardListado from "./ModalCardListado";
import { baseUrl } from "../utils/baseUrl";

const ListadoGeneral = () => {
  const [listadoProductos, setListadoProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const getListadoGeneral = async () => {
    setIsLoading(true);
    const productsRequest = await fetch(`${baseUrl}/listadogeneral`, {
      method: "GET",
      headers: { "content-type": "application/json" },
    });
    const products = await productsRequest.json();
    setListadoProductos(products);
    setIsLoading(false);
  };

  const modalProductoToggle = () => {
    setShowProductModal(!showProductModal);
  };

  const mostrarModal = (producto) => {
    setProductoSeleccionado(producto);
    modalProductoToggle();
  };

  useEffect(() => {
    getListadoGeneral();
  }, []);

  return (
    <div>
      <div>
        <h1 class="text-lg font-semibold text-blue-800 p-2 text-center">
          LISTADO GENERAL
        </h1>
        <input
          class="border-gray-700 border-[1px] rounded-md p-1 mb-2"
          placeholder="Ingrese su busqueda..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {isLoading && <Spinner />}
      {listadoProductos && (
        <>
          <table classname="table-auto width-[90vw]">
            <thead>
              <td class="border-[1px] border-gray-700 font-bold">Producto</td>
              <td class="border-[1px] border-gray-700 font-bold">Precio</td>
              {/* <td class="border-[1px] border-gray-700 font-bold">Categoria</td> */}
            </thead>
            <tbody>
              {listadoProductos
                .filter((item) => {
                  return search.toLowerCase() === ""
                    ? item
                    : item.titulo.toLowerCase().includes(search);
                })
                .map((producto) => (
                  <tr
                    key={producto._id}
                    class="odd:bg-white even:bg-slate-300 cursor-pointer 
                            hover:font-semibold hover:bg-blue-700 hover:text-white "
                    onClick={() => mostrarModal(producto)}
                  >
                    <td class="border-[1px] text-sm border-gray-700 break-words text-ellipsis overflow-hidden line-clamp-1 py-1">
                      {producto.titulo}
                    </td>
                    <td class="border-[1px] text-sm border-gray-700 break-words	py-1">
                      ${producto.ultimoPrecio}
                    </td>
                    {/* <td class="border-[1px] border-gray-700 break-words text-ellipsis overflow-hidden	">
                      {producto.categoria}
                    </td> */}
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
      {showProductModal && (
        <ModalCardListado
          _id={productoSeleccionado._id}
          modalProductoToggle={modalProductoToggle}
        />
      )}
    </div>
  );
};

export default ListadoGeneral;
