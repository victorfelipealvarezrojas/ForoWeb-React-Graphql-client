import React, { FC } from "react";
import Thread from "../../../models/Thread";
import { Link, useHistory } from "react-router-dom";
import { faEye, faHeart, faReplyAll } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import ThreadPointsBar from "../../points/ThreadPointsBar";
import "./ThreadCard.css";
import RichEditor from "../../editor/RichEditor";

interface ThreadCardProps {
  thread: Thread;
}

/*
    Este componente representará un solo registro de subproceso y
    mostrará cosas como su título, cuerpo y puntos... los puntos(like).
    los datos llegaran por medio de las props en thread y representara una sola publiacacion con sus propiedades
*/
const ThreadCard: FC<ThreadCardProps> = ({ thread }) => {
  //Thread parámetro que llega en las props.
  const history = useHistory();
  //obtengo las propiedades de la ventana en el navegador
  const { width } = useWindowDimensions();

  /*
    useHistory Hook me permite obtener el objeto del historial. Al hacer clic en el hilo(publicacion inicial/thread),
    usamos el objeto de history para redirigir la aplicación a una nueva URL en el evento click
  */
  const onClickShowThread = (e: React.MouseEvent<HTMLDivElement>) => {
    //en home tengo el componente Thread definido para esta ruta, navega hasta ese componente
    history.push("/thread/" + thread.id);
  };

  //vista mobile: con esta funcion creo la UI para mostrar los "me gusta" dependiendo de la resolucion de pantalla.( <= 768 mobile )
  const getPoints = (thread: Thread) => {
    if (width <= 768) {
      return (
        <label style={{ marginRight: ".75em", marginTop: ".25em" }}>
          {thread.points || 0}
          <FontAwesomeIcon
            icon={faHeart}
            className="points-icon"
            style={{ marginLeft: ".2em" }}
          />
        </label>
      );
    }
    return null;
  };

  //vista mobile: muestra cuántas respuestas de ThreadItems hay para este Thread. no aparece en el modo de escritorio cuando verificamos la propiedad de ancho de la pantalla
  const getResponses = (thread: Thread) => {
    if (width <= 768) {
      return (
        <label style={{ marginRight: ".5em" }}>
          {thread && thread.threadItems && thread.threadItems.length}
          <FontAwesomeIcon
            icon={faReplyAll}
            className="points-icon"
            style={{ marginLeft: ".25em", marginTop: "-.25em" }}
          />
        </label>
      );
    }
    return null;
  };

  //para la vista escritorio, devuelve la columna de puntos a la derecha de ThreadCard
  /*
  const getPointsNonMobile = () => {
    if (width > 768) {
      return (
        <div className="threadcard-points">
          <div className="threadcard-points-item">
            {thread.points || 0}
            <br />
            <FontAwesomeIcon icon={faHeart} className="points-icon" />
          </div>
          <div
            className="threadcard-points-item"
            style={{ marginBottom: ".75em" }}
          >
            {thread && thread.threadItems && thread.threadItems.length}
            <br /> <FontAwesomeIcon icon={faReplyAll} className="points-icon" />
          </div>
        </div>
      );
    }
    return null;
  };
  */

  return (
    <section className="panel threadcard-container">
      <div className="threadcard-txt-container">
        <div className="content-header">
          {/*Renderiza dentro del mismo Home por id de categoria, la ruta se encuentra definida en Home*/}
          <Link
            to={`/categorythreads/${thread.category.id}`}
            className="link-txt"
          >
            <strong>{thread.category.name}</strong>
          </Link>
          <span className="username-header" style={{ marginLeft: ".5em" }}>
            {thread.user.userName}
          </span>
        </div>
        <div className="question">
          <div
            onClick={onClickShowThread}
            data-thread-id={thread.id}
            style={{ marginBottom: ".4em", cursor: "pointer" }}
          >
            <strong>{thread.title}</strong>
          </div>
          <div
            className="threadcard-body"
            onClick={onClickShowThread}
            data-thread-id={thread.id}
          >
            {/*<div>{thread.body}</div>*/}
            <RichEditor existingBody={thread.body} readOnly={true} />
          </div>
          <div className="threadcard-footer">
            <span style={{ marginRight: ".5em" }}>
              <label>
                {thread.views}
                <FontAwesomeIcon icon={faEye} className="icon-lg" />
              </label>
            </span>
            <span>
              {
                //solo se mostraran en la vista mobile de lo contrario retornaran  null
                getPoints(thread)
              }
              {
                //solo se mostraran en la vista mobile de lo contrario retornaran  null
                getResponses(thread)
              }
            </span>
          </div>
        </div>
      </div>
      {/*solo se moostrara en escritorio de lo contrario retornara null contiene los likes y puntos del lateral del card de hilos*/}
      <ThreadPointsBar
        points={thread?.points || 0}
        responseCount={
          thread && thread.threadItems && thread.threadItems.length
        }
      />
    </section>
  );
};

export default ThreadCard;
