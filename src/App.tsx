import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/routes/Home";
import Thread from "./components/routes/thread/Thread";
import UserProfile from "./components/routes/userProfile/UserProfile";
import { gql, useQuery } from "@apollo/client";
import { ThreadCategoriesType } from "./store/categories/Reducer";
//redux
import { useDispatch } from "react-redux";
import { UserProfileSetType } from "./store/user/Reducer";

import "./App.css";
import useRefreshReduxMe from "./hooks/useRefreshReduxMe";

const GetAllCategories = gql`  query getAllCategories {    
  getAllCategories {      
    id      
    name    
  }  
}`;

function App() {
  const { data: categoriesData } = useQuery(GetAllCategories);
  //execMe obtiene el usuario activo desde el backend, update modifica el store de redux
  const { execMe, updateMe } = useRefreshReduxMe();
  const dispatch = useDispatch();

  //Aquí, llamamos a nuestro execMe para obtener los datos de usuario de GraphQL, este usuario es el amacenado en cache con su cesion iniciada.
  useEffect(() => {
    execMe();
  }, [execMe]);

  //Y aquí, llamamos a updateMe para actualizar nuestro Redux User Reducer con los datos del usuario si los hay
  //asi mantengo siempre cargada la info actualizada del usuariom activo en el store
  useEffect(() => {
    updateMe();
  }, [updateMe]);

  useEffect(() => {
    //almaceno las categorias en el store global de categorias, este stor es usado por CategoryDropDown
    if (categoriesData && categoriesData.getAllCategories) {
      dispatch({
        type: ThreadCategoriesType,//por medio del type se que reducer actualizar
        payload: categoriesData.getAllCategories
      })
    }
  }, [dispatch, categoriesData]);

  /*
    Esta función permite que todos las propiedades de la ruta, así como cualquier
    propiedad personalizado se incluyan en la inicialización de Home
  */
  const renderHome = (props: any) => <Home {...props} />;
  const renderThread = (props: any) => <Thread {...props} />;
  const renderUserProfile = (props: any) => <UserProfile {...props} />;

  return (
    <Switch>
      <Route exact={true} path="/" render={renderHome} />
      <Route path="/categorythreads/:categoryId" render={renderHome} />
      <Route path="/categorythreadsText/:categoryText" render={renderHome} />
      <Route path="/thread/:id?" render={renderThread} />{/*esta ruta la usare para visualizar  el thread o postear uno nuevo */}
      <Route path="/userprofile/:id" render={renderUserProfile} />
    </Switch>
  );
}

export default App;
