import React, { useState, useEffect } from "react";
import ProductCard from "./productCard.jsx";
import { baseUrl } from "../utils/baseUrl.js";
import Spinner from "./Spinner.jsx";

const SubaProductos = ({ handleModalProducto }) => {
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const getProducts = async () => {
    setIsLoading(true);
    const productsRequest = await fetch(`${baseUrl}/products?page=${page}`, {
      method: "GET",
      headers: { "content-type": "application/json" },
    });
    const products = await productsRequest.json();
    setProductsList((prevProducts) => [...prevProducts, ...products]);
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
    getProducts();
  }, [page]);

  return (
    <div class="py-4">
      {productsList && (
        <>
          <div>
            <h1 class="text-lg font-semibold text-blue-800 p-2 text-center">
              PRODUCTOS CON AUMENTOS DE PRECIO:
            </h1>
            <div class="flex flex-wrap gap-4">
              {productsList.map((product) => (
                <ProductCard
                  product={product}
                  handleModalProducto={handleModalProducto}
                />
              ))}
            </div>
          </div>
          {isLoading && <Spinner class="mb-8" />}
        </>
      )}
    </div>
  );
};

export default SubaProductos;
