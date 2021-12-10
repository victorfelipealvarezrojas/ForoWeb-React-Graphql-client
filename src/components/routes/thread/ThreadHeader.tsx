import React, { FC } from "react";
import UserNameAndTime from "./UserNameAndTime";

interface ThreadHeaderProps {
    userName?: string;
    lastModifiedOn: Date;
    title?: string;
}

/*
    ThreadHeader actúa como un componente de solo visualización.
    Muestra el título del hilo,el nombre de usuario y el tiempo
    trascurrido desde la modificacion.
*/
const ThreadHeader: FC<ThreadHeaderProps> = ({ title, userName, lastModifiedOn }) => {

    return (
        <div className="thread-header-container">
            <h3>{title}</h3>
            {/*Componente que muestar quien publico(userName) y el tiempo que trascurrio desde la publicacion(lastModifiedOn)*/}
            <UserNameAndTime
                userName={userName}
                lastModifiedOn={lastModifiedOn}
            />
        </div>
    );
};

export default ThreadHeader;
