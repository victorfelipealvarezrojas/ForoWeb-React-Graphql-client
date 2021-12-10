import {
  faRegistered,
  faSignInAlt,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import User from "../../../models/User";
import { AppState } from "../../../store/AppState";
import Login from "../../auth/Login";
import Logout from "../../auth/Logout";
//modal que llamare para registrar usuario
import Registration from "../../auth/Registration";

import "./SideBarMenus.css";

const SideBarMenus = () => {
  //hook de registro
  const [showRegister, setShowRegister] = useState(false);
  //hook de inicio de sesion
  const [showLogin, setShowLogin] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  //obtengo el usuario desde el reducer
  const user: User | null = useSelector((state: AppState) => state.user);

  const onClickToggleRegister = () => {
    setShowRegister(!showRegister);
  };

  const onClickToggleLogin = () => {
    setShowLogin(!showLogin);
  };

  const onClickToggleLogout = () => {
    setShowLogout(!showLogout);
  };

  return (
    <React.Fragment>
      <ul>
        {
          user &&
          <li>
            <FontAwesomeIcon icon={faUser} />
            <span className="menu-name">
              <Link to={`/userprofile/${user?.id}`}>{user?.userName}</Link>
            </span>
          </li>
        }
        {
          !user &&
          <li>
            <FontAwesomeIcon icon={faRegistered} />
            <span onClick={onClickToggleRegister} className="menu-name">
              Registro
            </span>
            <Registration
              isOpen={showRegister}
              onClickToggle={onClickToggleRegister}
            />
          </li>
        }
        {
          !user &&
          <li>
            <FontAwesomeIcon icon={faSignInAlt} />
            <span onClick={onClickToggleLogin} className="menu-name">
              Inisio Sesion
            </span>
            <Login isOpen={showLogin} onClickToggle={onClickToggleLogin} />
          </li>
        }
        {
          user &&
          <li>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span onClick={onClickToggleLogout} className="menu-name">
              Cerrar Sesion
            </span>
            <Logout isOpen={showLogout} onClickToggle={onClickToggleLogout} />
          </li>
        }
      </ul>
    </React.Fragment>
  );
};

export default SideBarMenus;
