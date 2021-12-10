import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import TopCategory from "./TopCategory";
import groupBy from "lodash/groupBy";
//import { getTopCategories } from "../../../services/DataService";
import "./RightMenu.css";
import { gql, useQuery } from "@apollo/client";

const GetTopCategoryThread = gql`
  query getTopCategoryThread {
    getTopCategoryThread {
      threadId
      categoryId
      categoryName
      title
    }
  }
`;

const RightMenu = () => {
  const { data: categoryThreadData } = useQuery(GetTopCategoryThread);
  //se usa para almacenar la matriz de categorias(JSX.Element) contendra aray de elementos JSX
  const [topCategories, setTopCategories] = useState<Array<JSX.Element> | undefined>();

  useEffect(() => {
    if (categoryThreadData && categoryThreadData.getTopCategoryThread) {
      console.log(categoryThreadData.getTopCategoryThread)
      const topCatThreads = groupBy(categoryThreadData.getTopCategoryThread,"categoryName");
      console.log(topCatThreads)
      const topElements = [];
      for (let key in topCatThreads) {
        const currentTop = topCatThreads[key];
        console.log(currentTop)
        topElements.push(<TopCategory key={key} topCategories={currentTop} />);
      }
      setTopCategories(topElements);
    }
  }, [categoryThreadData]);


  /*
    al desestructurar la respuesta del custom hook obtengo height,
    width que me indica si la ventana del navegador tiene un ancho <= 768px
  */
  const { width } = useWindowDimensions();
  //si la pantalla actual es menor o igual a 768
  if (width <= 768) {
    return null;
  }
  //renderizo el hook que cointiene los elementos jsx
  return <div className="rightmenu rightmenu-container">{topCategories}</div>;
};

export default RightMenu;
