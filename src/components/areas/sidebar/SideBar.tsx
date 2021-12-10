import React from "react";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import SideBarMenus from "./SideBarMenus";

const SideBar = () => {
    /*
        al desestructurar la respuesta del custom hook obtengo height,
        width que me indica si la ventana del navegador tiene un ancho <= 768px
    */
    const {width} = useWindowDimensions();
    //si la pantalla actual es menor o igual a 768
    if(width <= 768){
        return null;
    }

    return <div className="sidebar">
        <SideBarMenus />
    </div>;
};

export default SideBar;