import React, { FC, useEffect, useState } from "react";
import ThreadItem from "../../../models/ThreadItem";
import ThreadResponse from "./ThreadResponse";

//Este componente recibirá un accesorio que contiene una lista de ThreadItems
interface ThreadResponsesBuilderProps {
  threadItems?: Array<ThreadItem>;
  readOnly: boolean;
  refreshThread?: () => void;
}

//este componente se encarga de renderizar la respuesta de los hilos, recibe por props un array de respeustas
const ThreadResponsesBuilder: FC<ThreadResponsesBuilderProps> = ({ threadItems, readOnly,refreshThread }) => {

  //hook de tipo jsx que renderizara al componente ThreadResponse(componente de respuestas)
  const [responseElements, setResponseElements] = useState<JSX.Element | undefined>();

  useEffect(() => {
    if (threadItems) {
      //recorro mi array de respuestas con un map
      const thResponses = threadItems.map((ti) => {
        return (
          //asigno en contenido que llega desde las props al componente encargado de renderizar las respuestas
          <li key={`thr-${ti.id}`}>
            {/*Ahora estamos pasando el componente ThreadReponse, que muestra los ThreadItem */}

            
            <ThreadResponse
              body={ti.body}
              userName={ti.user.userName}
              lastModifiedOn={ti.createdOn}
              points={ti.points}
              readOnly={readOnly}          
              threadItemId={ti?.id || "0"}
              threadId={ti.thread.id}
              refreshThread ={refreshThread}
            />
          </li>
        );
      });
      //le asigno al hook el componente de las respeustas
      setResponseElements(<ul>{thResponses}</ul>);
    }
  }, [threadItems, readOnly]);

  return (
    <div className="thread-body-container">
      <strong style={{ marginBottom: ".75em" }}>Respuestas</strong>
      {responseElements}
    </div>
  );
};

export default ThreadResponsesBuilder;