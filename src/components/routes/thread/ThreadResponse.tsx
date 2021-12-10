import React, { FC, useEffect, useState } from "react";
import RichEditor from "../../editor/RichEditor";
import UserNameAndTime from "./UserNameAndTime";
import ThreadPointsInline from "../../points/ThreadPointsInline";
import { gql, useMutation } from '@apollo/client'
import { useSelector } from "react-redux";
import { AppState } from "../../../store/AppState";
import {  Node } from "slate";

const CreateThreadItem = gql`
    mutation createThreadItem(
      $userId: ID!, 
      $threadId: ID!, 
      $body: String!
    ){
    createThreadItem(  
      userId: $userId, 
      threadId: $threadId, 
      body: $body
      ){
        messages
      }
    }
`;

interface ThreadResponseProps {
    body?: string;
    userName?: string;
    lastModifiedOn?: Date;
    points: number;
    readOnly: boolean;
    threadItemId: string;
    threadId?: string;
    refreshThread?: () => void;
}

const ThreadResponse: FC<ThreadResponseProps> = ({
    body,//respuesta texto
    userName,//nombre de usuario que realizo la respuesta
    lastModifiedOn,//fecha en la que respondio
    points,//likes de su respuesta
    readOnly,
    threadItemId,
    threadId,
    refreshThread
}) => {

    const user = useSelector((state: AppState) => state.user);
    const [execCreateThreadItem] = useMutation(CreateThreadItem);
    const [postMsg, setPostMsg] = useState("");
    const [bodyToSave, setBodyToSave] = useState("");

    useEffect(() => {
        if (body) {
            setBodyToSave(body || "");
        }
    }, [body]);

    const onClickPost = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (!user) {
            setPostMsg("Inicie Sesion antes de publicar una respuesta.");
        } else if (!threadId) {
            setPostMsg("Debe existir un hilo primario antes de que se pueda publicar una respuesta.");
        } else if (!bodyToSave) {
            setPostMsg("Ingrese Contenido.");
        } else {
            await execCreateThreadItem({
                variables: {
                    userId: user ? user.id : "0",
                    threadId,
                    body: bodyToSave,
                },
            });
            refreshThread && refreshThread();
        }
    };

    const receiveBody = (body: Node[]) => {
        const newBody = JSON.stringify(body);
        if (bodyToSave !== newBody) {
            setBodyToSave(newBody);
        }
    };

    return (
        //este componente se encarga de representar las respuestas del hilo, puede ser una lista de respuestas dependiendo del llamado
        <div>
            <div>
                {threadItemId}
                {/*Nombre de usuario y momento en el cual realizo la respuesta */}
                <UserNameAndTime userName={userName} lastModifiedOn={lastModifiedOn} />
                {
                    /*
                        NOTA de ThreadPointsInline:
                          Representa la puntuacion y el icono de corazon dentro de la respuesta similar a threerad, 
                          tendra los eventos de modificacion de puntacion > o <
                    */
                }
                {readOnly ? (
                    <span style={{ display: "inline-block", marginLeft: "1em" }}>
                        <ThreadPointsInline
                            points={points || 0}
                            threadItemId={threadItemId}
                            refreshThread={refreshThread}
                            allowUpdatePoints={true}
                        />
                    </span>
                ) : null}
            </div>
            <div className="thread-body-editor">
                <RichEditor
                    existingBody={bodyToSave}
                    readOnly={readOnly}
                    sendOutBody={receiveBody}
                />
            </div>
            {!readOnly && threadId ? (
                <>
                    <div style={{ marginTop: ".5em" }}>
                        <button className="action-btn" onClick={onClickPost}>
                            Post Response
                        </button>
                    </div>
                    <strong>{postMsg}</strong>
                </>
            ) : null}
        </div>
    );
};

export default ThreadResponse;