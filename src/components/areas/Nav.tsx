import React, { useState } from "react";
import ReactModal from "react-modal";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import SideBarMenus from "./sidebar/SideBarMenus";

import "./Nav.css";

const Nav = () => {
    //hook que activa el modal
    const [showMenu, setShowMenu] = useState(false);
    const { width } = useWindowDimensions();

    //si la resolucion es d ecelular muestro el icono del menu mobile
    const getMobileMenu = () => {
        if (width <= 768) {
            return (
                <FontAwesomeIcon
                    onClick={onClickToggle}
                    icon={faBars}
                    size="lg"
                    className="nav-mobile-menu"
                />
            );
        }

        return null;
    };

    const onClickToggle = (e: React.MouseEvent<Element, MouseEvent>) => {
        setShowMenu(!showMenu);
    };

    const onRequestClose = (e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>) => {
        setShowMenu(false);
    };

    return (
        <React.Fragment>
            <ReactModal
                ariaHideApp={false}
                className="modal-menu"
                isOpen={showMenu}
                onRequestClose={onRequestClose}
                shouldCloseOnOverlayClick={true}
            >
                <SideBarMenus />
            </ReactModal>
            <nav className = "navigation">
                {getMobileMenu()}
                <strong>Foro WEB</strong>
            </nav>
        </React.Fragment>
    );
};
export default Nav;
