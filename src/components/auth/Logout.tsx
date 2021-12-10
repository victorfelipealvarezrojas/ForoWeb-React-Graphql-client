import React, { FC } from "react";
import { gql, useMutation } from "@apollo/client";
import ReactModal from "react-modal";
import ModalProps from "../types/ModalProps";
import { useSelector } from "react-redux";
import { AppState } from "../../store/AppState";
import User from "../../models/User";
import "./Logout.css";
import useRefreshReduxMe, { Me } from "../../hooks/useRefreshReduxMe";


const LogoutMutation = gql`  
    mutation logout($userName: String!) {    
        logout(userName: $userName)  
    }`;

const Logout: FC<ModalProps> = ({ isOpen, onClickToggle }) => {
    //obtengo varioables globales del store relacionadas al usuario, AppState contiene el combine reducers
    const usuario: User | null = useSelector((state: AppState) => state.user);
    //defino la mutacion encargada de cerrar sesion
    const [execLogin] = useMutation(LogoutMutation, {
        //refetchQueries obliga a que se vuelva a ejecutar cualquier consulta que se enumere en ella 
        refetchQueries: [
            {
                query: Me,
            },
        ],
    });
    //La función execMe obtendrá el último objeto User y updateMe lo agregará a la tienda Redux o deleteMe que elimina el dato del store. 
    //Queremos crear este hook para  establecer o desestablecer nuestro objeto de usuario Redux y ademas pueda estar en este único archivo.
    const { deleteMe } = useRefreshReduxMe();

    const onClickLogout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        onClickToggle(e);
        await execLogin({
            variables: {
                userName: usuario?.userName ?? "",
            }
        });
        deleteMe();
    };

    const onClickCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        onClickToggle(e);
    };

    return (
        <ReactModal
            className="modal-menu"
            isOpen={isOpen}
            onRequestClose={onClickToggle}
            shouldCloseOnOverlayClick={true}
        >
            <form>
                <div className="logout-inputs">
                    ¿Está seguro de que desea cerrar la sesión?
                </div>
                <div className="form-buttons form-buttons-sm">
                    <div className="form-btn-left">
                        <button
                            style={{ marginLeft: ".5em" }}
                            className="action-btn"
                            onClick={onClickLogout}
                        >
                            Cerrar Sesion
                        </button>
                        <button
                            style={{ marginLeft: ".5em" }}
                            className="cancel-btn"
                            onClick={onClickCancel}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </form>
        </ReactModal>
    )
}

export default Logout;