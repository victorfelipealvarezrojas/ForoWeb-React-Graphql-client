import { useState, useEffect } from "react";

/*
    Primero, creamos una interfaz llamada WindowDimension para que podamos escribir lo que devuelve nuestro Hook,
    que en este caso son las dimensiones del objeto de la ventana del navegador.
*/
export interface WindowDimension {
  height: number;
  width: number;
}

//nombramos nuestro custom hook useWindowDimensions
export const useWindowDimensions = (): WindowDimension => {
  //creamos un objeto de estado llamado dimension
  const [dimension, setDimension] = useState<WindowDimension>({
    height: 0,
    width: 0,
  });

  /*
    utilizará el método de actualización de estado, setDimension, para establecer nuestros valores de dimensión.
    El objeto de ventana de nuestro navegador proporciona los valores de dimensión
  */
  const handleResize = () => {
    setDimension({
      height: window.innerHeight,//ventana de nuestro navegador, valor actual de dimensión en la que se encuentra
      width: window.innerWidth,//ventana de nuestro navegador valor actial de dimedsión en la cual se encuentra
    });
  };

  //useEffect se utilizara para manejar el evento de cambio de tamaño de la ventana y re-dimensión al cambiar de dispositivo
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);//ve ejecutará solo una vez en la primera carga

  return dimension;
};