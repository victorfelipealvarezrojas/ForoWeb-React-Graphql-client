import React, { FC } from "react";
import Nav from "../areas/Nav";
import SideBar from "../areas/sidebar/SideBar";
import LeftMenu from "../areas/LeftMenu";
import Main from "../areas/main/Main";
import RightMenu from "../areas/rightMenu/RightMenu";
import "./Home.css";

const Home: FC = () => {
  return (
    <div className="screen-root-container home-container">
      <div className="navigation">
        <Nav />{/*barra superior con titulo app y opcion de menu mobile*/}
      </div>
      <SideBar />{/*barra lateral con titulo app y opcion de menu escritorio*/}
      <LeftMenu />{/*listado de categorias*/}
      <Main />{/*contenido con publicaciones*/}
      <RightMenu />{/*lista de publicaciones principales por categoria*/}
    </div>
  );
};

export default Home;