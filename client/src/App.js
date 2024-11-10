import './App.css';
import { useState } from "react";
import ModalCard from './components/ModalCard';
import ListadoGeneral from './components/ListadoGeneral';
import Estadisticas from './components/Estadisticas';
import SubaProductos from './components/SubaProductos';
import BajaProductos from './components/BajaProductos';

function App() {

  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [productoModal, setProductoModal] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [view, setView] = useState("subaProductos");

  const toggleModalProducto = () => {
    setShowModal(!showModal)
  }
  const convertirCodigoASrc = (codigo) => {
    if (!codigo) {
      return;
    }
    let trimmedCode = codigo.replace("prod-", "") + ".png";
    return trimmedCode;
  };
  const handleModalProducto = (product) => {
    setProductoModal(product);
    setImgUrl(cloudinaryBaseUrl + convertirCodigoASrc(product.codigo));
    console.log(productoModal);
    toggleModalProducto();
  }

  const cloudinaryBaseUrl = "https://res.cloudinary.com/pinguino/image/upload/autoupload/"


  return (
    <div class="p-4">
      <div class="flex gap-4 mb-4 flex-wrap justify-center mx-auto">
        <h2 class="bg-blue-700 p-2 text-white font-bold text-lg cursor-pointer rounded-md"
          onClick={() => setView("subaProductos")}>Productos con Aumento Mensual</h2>
        <h2 class="bg-red-700 p-2 text-white font-bold text-lg cursor-pointer rounded-md"
          onClick={() => setView("bajaProductos")}>Productos con Baja Mensual</h2>
        <h2 class="bg-green-700 p-2 text-white font-bold text-lg cursor-pointer rounded-md"
          onClick={() => setView("estadisticas")}>Estadisticas</h2>
        <h2 class="bg-yellow-600 p-2 text-white font-bold text-lg cursor-pointer rounded-md"
          onClick={() => setView("listadoGeneral")}>Listado General</h2>
      </div>
      <div class="flex gap-4 flex-row flex-wrap">
        {view === "subaProductos" && <SubaProductos handleModalProducto={handleModalProducto} />}
        {view === "bajaProductos" && <BajaProductos handleModalProducto={handleModalProducto} />}
        {view === "listadoGeneral" && <ListadoGeneral />}
        {view === "estadisticas" && <Estadisticas />}
      </div>
      {showModal && <ModalCard productoModal={productoModal} toggleModalProducto={toggleModalProducto} imgUrl={imgUrl} />}
    </div>
  );
}

export default App;
