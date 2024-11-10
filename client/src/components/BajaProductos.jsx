import React, { useState, useEffect } from "react";
import ProductCard from "./productCard";
import Spinner from "./Spinner";

const BajaProductos = ({ handleModalProducto }) => {
  const baseUrl = process.env.REACT_APP_BASEURL;
  const [bajaProductosLista, setBajaProductosLista] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const getBajaProductos = async () => {
    const request = await fetch(`${baseUrl}/bajaproductos?page=${page}`, {
      method: "GET",
      headers: { "content-type": "application/json" },
    });
    const bajaProductos = await request.json();
    setBajaProductosLista((prevProducts) => [
      ...prevProducts,
      ...bajaProductos,
    ]);
    setIsLoading(false);
  };
  const handleScroll = () => {
    if (
      document.body.scrollHeight - 300 <
      window.scrollY + window.innerHeight
    ) {
      setIsLoading(true);
    }
  };

  window.addEventListener("scroll", debounce(handleScroll, 500));
  // debounce function
  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }

  useEffect(() => {
    if (isLoading == true) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading]);

  useEffect(() => {
    getBajaProductos();
  }, [page]);

  return (
    <div>
      <>
        <div class="w-full justify-center">
          <h1 class="text-lg font-semibold text-blue-800 p-2 text-center">
            PRODUCTOS CON BAJA DE PRECIO:
          </h1>
          <div class="flex flex-wrap gap-4 justify-center mx-auto">
            {bajaProductosLista.map((product) => (
              <ProductCard
                product={product}
                handleModalProducto={handleModalProducto}
              />
            ))}
          </div>
        </div>
      </>
      {isLoading && <Spinner class="mb-8" />}
    </div>
  );
};

export default BajaProductos;
