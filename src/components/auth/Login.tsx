import React, { FC, useReducer, useEffect } from "react";
import ReactModal from "react-modal";
import ModalProps from "../types/ModalProps";
import userReducer from "./common/UserReducer";//reducer de valores del formulario
import { allowSubmit } from "./common/Helpers";
import { gql, useMutation } from "@apollo/client";
import useRefreshReduxMe, { Me } from "../../hooks/useRefreshReduxMe";

const LoginMutation = gql`  
  mutation Login($userName: String!, $password: String!)  {    
    login(userName: $userName, password: $password)  
  }`;

const Login: FC<ModalProps> = ({ isOpen, onClickToggle }) => {
  //mutacion de inicio de sesion
  const [execLogin] = useMutation(LoginMutation, {
    //refetchQueries obliga a que se vuelva a ejecutar cualquier consulta que se enumere en ella 
    //Si no usábamos refetchQueries y volviéramos a ejecutar la consulta Me, terminaríamos obteniendo la última versión almacenada en caché en lugar de los datos más actualizados
    //no actualiza automáticamente ninguna llamada que dependa de sus consultas; todavía tenemos que hacer esas llamadas para obtener los nuevos datos.
    //Después de que execLogin finalice, llamará automáticamente a nuestra lista de consultas refetchQueries.
    refetchQueries: [
      //almacena en caché sus valores
      {
        query: Me,
      },
    ],
  });

  //REDUCER DE FORMULARIO: desestructuro las propiedades  de mi reducer que controla los valores del formulario de autenticacion
  const [
    {
      userName, password, resultMsg, isSubmitDisabled
    },
    dispatch
  ] =
    useReducer(userReducer, {
      userName: "",
      password: "",
      resultMsg: "",
      isSubmitDisabled: true, //lo utilizo para bloquear el submit del boton
    });

  //La función execMe obtendrá el último objeto User y updateMe lo agregará a la tienda Redux. 
  //Queremos crear este hook para  establecer o desestablecer nuestro objeto de usuario Redux y ademas pueda estar en este único archivo.
  const { execMe, updateMe } = useRefreshReduxMe();

  const onChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "userName",
      payload: e.target.value,
    });

    if (!e.target.value)
      allowSubmit(dispatch, "El nombre de usuario no puede estar vacío", true);
    else allowSubmit(dispatch, "", false);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "password",
      payload: e.target.value,
    });

    if (!e.target.value)
      allowSubmit(dispatch, "La contraseña no puede estar vacía", true);
    else allowSubmit(dispatch, "", false);
  };

  const onClickLogin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    onClickToggle(e);//cierro el popup, lugo agregare la funcionalidad
    //ejecuto la mutacion de graphql
    const resultado = await execLogin({
      variables: {
        userName,
        password,
      },
    });
    //La función execMe obtendrá el último objeto User(el usuario en sesion) y updateMe lo agregará a la tienda Redux y vienen desde el hook useRefreshReduxMe. 
    console.log("login", resultado);
    execMe();
    updateMe();
  };

  const onClickCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onClickToggle(e);//cierro el popup 
  };

  return (
    <ReactModal
      className="modal-menu"
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={onClickToggle}
      shouldCloseOnOverlayClick={true}
    >
      <form>
        <div className="reg-inputs">
          <div>
            <label>Nombre Usuario</label>
            <input type="text" value={userName} onChange={onChangeUserName} />
          </div>
          <div>
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={onChangePassword}
            />
          </div>
        </div>
        <div className="form-buttons form-buttons-sm">
          <div className="form-btn-left">
            <button
              style={{ marginLeft: ".5em" }}
              className="action-btn"
              disabled={isSubmitDisabled}
              onClick={onClickLogin}
            >
              Iniciar Sesion
            </button>
            <button
              style={{ marginLeft: ".5em" }}
              className="cancel-btn"
              onClick={onClickCancel}
            >
              Cerrar
            </button>
          </div>

          <span className="form-btn-left">
            <strong>{resultMsg}</strong>
          </span>
        </div>
      </form>
    </ReactModal>
  );
};

export default Login;
