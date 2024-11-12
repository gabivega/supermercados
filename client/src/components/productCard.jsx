import React from "react";

const ProductCard = ({ product, handleModalProducto, setImgUrl }) => {
  const convertirCodigoASrc = (codigo) => {
    if (!codigo) {
      return;
    }
    let trimmedCode = codigo.replace("prod-", "") + ".png";
    return trimmedCode;
  };
  const cloudinaryBaseUrl =
    "https://res.cloudinary.com/pinguino/image/upload/autoupload/";

  const productLastPrice = product?.precio.length - 1;
  const currentMonth = new Date().getMonth();
  const primerPrecioMes =
    product.variacionesMensuales[currentMonth][0].primerPrecioMes.toFixed();
  const porcentajeVariacionMensual =
    product.variacionesMensuales[
      currentMonth
    ][0].porcentajeVariacionMensual.toFixed();
  return (
    <div
      class="border-gray-400 flex flex-col border-[1px] rounded h-[280px] w-[220px] flex-shrink-0 p-2 cursor-pointer"
      onClick={() => {
        handleModalProducto(product);
      }}
    >
      <h3 class="text-grey-800 font-semibold basis-[30%] text-lg line-clamp-2">
        {product.titulo}
      </h3>
      <img
        src={cloudinaryBaseUrl + convertirCodigoASrc(product.codigo)}
        onError={(event) => {
          event.target.src =
            "https://www.pinguino.com.ar/static/img/articulos/noDisponible.jpg";
          event.onerror = null;
        }}
        alt=""
        class="w-[100px] h-[100px] mx-auto"
      />
      <p class="text-red-600 font-bold text-xl text-center">
        ${product.precio[productLastPrice].precio}
      </p>
      <p class="font-semibold text-sm">
        Precio al inicio del Mes:
        <span class="text-blue-800 font-bold pl-1">${primerPrecioMes}</span>
      </p>
      <p class="font-semibold text-sm">
        Variacion Mensual:{porcentajeVariacionMensual}%
      </p>
    </div>
  );
};

export default ProductCard;
