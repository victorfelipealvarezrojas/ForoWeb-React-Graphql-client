import { FC, useReducer } from "react";
import ReactModal from "react-modal";
import userReducer from "./common/UserReducer";
import {
  isPasswordValid,
  PasswordTestResult,
} from "./../../common/validators/PasswordValidator";
import ModalProps from "../types/ModalProps";
import { allowSubmit } from "./common/Helpers";

import "./Registration.css";

//isOpen controla como se muestra el modal
//onClickToggle  controla ocultar y mostrar modal
const Registration: FC<ModalProps> = ({ isOpen, onClickToggle }) => {
  //isSubmitDisabled, deshabilita el botón de registro si los valores dados no son correctos boolean
  //obtengo los valores de mi state desde el reducer
  const [{ userName, password, email, passwordConfirm, resultMsg,isSubmitDisabled }, dispatch] =
    useReducer(userReducer, {
      userName: "",
      password: "",
      email: "",
      passwordConfirm: "",
      resultMsg: "",
      isSubmitDisabled: true,
    });


  //La función onChangeUserName se utiliza para establecer un nombre de usuario y validar si el registro puede continuar.
  const onChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    //modifica el userName en el reduces
    dispatch({
      payload: e.target.value,
      type: "userName",
    });

    if (!e.target.value)
    allowSubmit(dispatch,"El nombre de usuario no puede estar vacío", true);
    else allowSubmit(dispatch,"", false);
  };

  //La función onChangeEmail se utiliza para establecer el onChangeEmail y validar si el registro puede continuar.
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      payload: e.target.value,
      type: "email",
    });

    if (!e.target.value) allowSubmit(dispatch,"El correo no puede estar vacío", true);
    else allowSubmit(dispatch,"", false);
  };

  //valida la contraseña para ver si puede continuar con el registro
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      payload: e.target.value,
      type: "password",
    });
    //valido password con expresion regular
    const passwordCheck: PasswordTestResult = isPasswordValid(e.target.value);
    //no es valida la contraseña
    if (!passwordCheck.isValid) {
      allowSubmit(dispatch,passwordCheck.message, true);
      return;
    }
    //valido que las contyraseña de confirmacion y la contraseña sean iguales.
    passwordsSame(passwordConfirm, e.target.value);
  };

  //valido la confiormacion de la password
  const onChangePasswordConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      payload: e.target.value,
      type: "passwordConfirm",
    });
    //valida que sean iguales
    passwordsSame(password, e.target.value);
  };

  //funcion que valida que las contraseñas sean iguales
  const passwordsSame = (passwordVal: string, passwordConfirmVal: string) => {
    if (passwordVal !== passwordConfirmVal) {
      allowSubmit(dispatch,"Contraseñas no son iguales", true);
      return false;
    } else {
      allowSubmit(dispatch,"", false);
      return true;
    }
  };

  //realiza el registro del usuario
  const onClickRegister = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    console.log(userName);
    onClickToggle(e);
  };

  const onClickCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onClickToggle(e);
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
            <label>username</label>
            <input type="text" value={userName} onChange={onChangeUserName} />
          </div>
          <div>
            <label>email</label>
            <input type="text" value={email} onChange={onChangeEmail} />
          </div>
          Here, we have our email field.
          <div>
            <label>password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={onChangePassword}
            />
          </div>
          <div>
            <label>password confirmation</label>
            <input
              type="password"
              placeholder="Password Confirmation"
              value={passwordConfirm}
              onChange={onChangePasswordConfirm}
            />
          </div>
        </div>
        <div className="reg-buttons">
          <div className="reg-btn-left">
            <button
              style={{ marginLeft: ".5em" }}
              className="action-btn"
              disabled={isSubmitDisabled}
              onClick={onClickRegister}
            >
              Registrar
            </button>
            <button
              style={{ marginLeft: ".5em" }}
              className="cancel-btn"
              onClick={onClickCancel}
            >
              Cerrar
            </button>
          </div>
          <span className="reg-btn-right">
            <strong>{resultMsg}</strong>
          </span>
        </div>
      </form>
    </ReactModal>
  );
};

export default Registration;
