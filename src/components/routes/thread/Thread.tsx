import { useEffect, useReducer, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ThreadHeader from "./ThreadHeader";
import ThreadModel from "../../../models/Thread";
//import { getThreadById } from "../../../services/DataService";
import Nav from "../../areas/Nav";
import ThreadTitle from "./ThreadTitle";
import ThreadBody from "./ThreadBody";
import ThreadPointsBar from "../../points/ThreadPointsBar";
import ThreadResponsesBuilder from "./ThreadResponsesBuilder";
//import CategoryDropDown from "../../CategoryDropDown";
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import "./Thread.css";
import ThreadCategory from "./ThreadCategory";
import ThreadPointsInline from "../../points/ThreadPointsInline";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import { getTextFromNodes } from "../../editor/RichEditor";
import { useSelector } from "react-redux";
import { AppState } from "../../../store/AppState";
import Category from "../../../models/Category";
import { Node } from "slate";
import ThreadResponse from "./ThreadResponse";

//consulta GraphQL para desplegar la info del Thread seleccionado, esta pantalla muestra el thread y permite mofificarlo
const GetThreadById = gql`
    query GetThreadById($id: ID!){
        getThreadById(id: $id){
            ... on EntityResult {
                    messages
                }
            ... on Thread {
                id 
                user{
                    id ##se usa con el fin de determinar que este usuario no está tratando de aumentar sus propios puntos.
                    userName
                }
                lastModifiedOn
                title
                body
                points
                category{
                    id 
                    name
                }
                threadItems {          
                    id          
                    body          
                    points          
                    user {     
                        id ##De nuevo, necesitaremos este campo para comprobar que un usuario no está actualizando sus propios puntos.       
                        userName          
                    }
                    thread{
                    id
                  }
                }
            }
        }
    }`;

const CreateThread = gql`
    mutation createThread(
      $userId: ID!
      $categoryId: ID!
      $title: String!
      $body: String!
    ){
        createThread(
            userId: $userId
            categoryId: $categoryId
            title: $title
            body: $body
        )
        {
            messages
        }

    }`;

//manejo los cambios de valores del formulario po medio de un reductor
const threadReducer = (state: any, action: any) => {
    switch (action.type) {
        case "userId":
            return {
                ...state,
                userId: action.payload
            };
        case "category":
            return {
                ...state,
                category: action.payload
            };
        case "title":
            return {
                ...state,
                title: action.payload
            };
        case "body":
            return {
                ...state,
                body: action.payload
            };
        case "bodyNode":
            return {
                ...state,
                bodyNode: action.payload
            };
        default:
            throw new Error("Tipo de acción desconocido");
    }
};



const Thread = () => {
    const { width } = useWindowDimensions();
    //me obligo a definir la propiedad del useParams, en versiones anteriores no pasaba
    interface proper {
        id: any
    }
    //Hook para el manejo de consiltas GraphQL, con useLazyQuery para carga a demanda, Pjo aqui
    //NOTA: Graphql guarda todo en cache y si no lo desabilito va a buscar la consulta en memoria en lugar de violver a obtener el registro de la BD, la otra opcion es
    //refetchQueries pero guarda en cache todas las consultas de GraphQL de forma predeterminada
    const [execGetThreadById, { data: threadData }] = useLazyQuery(GetThreadById, {
        fetchPolicy: "no-cache", //le indico que no almacena la consulta en cache
    });
    //objeto de estado de thread local, alcascenara el resultado de la consulta es lo que usaremos para rellenar nuestra interfaz de usuario y compartirla con otros componentes.
    const [thread, setThread] = useState<ThreadModel | undefined>();
    //obtiene la identificación del parámetro de ruta, el Id es la identificación del subproceso o thread para esta ruta.
    const { id } = useParams<proper>();
    //Usaremos este estado readOnly para hacer que nuestro RichEditor sea de solo lectura si estamos tratando con un registro Thread existente.
    const [readOnly, setReadOnly] = useState(false);

    //accedo a mi state del usuario de redux
    const user = useSelector((state: AppState) => state.user);

    //utilizo el reducer que controla el valor del formulario
    const [{ userId, category, title, body, bodyNode }, threadReducerDispatcher,] = useReducer(threadReducer, {
        userId: user ? user.id : "0",
        category: undefined,
        title: "",
        body: "",
        bodyNode: undefined,
    });

    const [postMsg, setPostMsg] = useState("");

    const [execCreateThread] = useMutation(CreateThread);

    const history = useHistory();

    //funcion que se gatillara desde el hijo(se pasa a ThreadPointBar en las props) para actualizar la vista de los hilos o thread en los cards
    const refreshThread = () => {
        if (id && id > 0) {
            execGetThreadById({
                variables: {
                    id,
                },
            });
        }
    };


    useEffect(() => {
        //si el parámetro id route existe y es mayor que 0, intentamos obtener nuestro hilo
        //ejectuto consulta GrapHQl y envio parametro de entrada Id, el resultado de la cosnulta se almacenara de forma automatica en threadData por medio del useLazyQuery
        console.log("id");
        if (id && id > 0) {
            execGetThreadById({
                variables: {
                    id,
                },
            });
        }
        /*****Drata local*****
            funcion que me devuelve un hilo/publicacion unico por Id
            getThreadById(id).then((th) => {
              setThread(th);//actualizo hook de estado local
            });*/
    }, [id, execGetThreadById]);

    //este hook esta asociado al cambio de usuario del reducer local que mentienme los valoresz del formulario, asignandole el user del store de redux
    useEffect(() => {
        threadReducerDispatcher({
            type: "userId",
            payload: user ? user.id : "0",
        });
        //se ejecuta cuando se obtiene  el valor del reducer de redux para el user
    }, [user]);


    //utiliso un nuevo useEffect asociado al evento de la consulta graphql (execGetThreadById) ejecutada anteriormente para obtener la data de al API
    useEffect(() => {
        if (threadData && threadData.getThreadById) {
            setThread(threadData.getThreadById);
            setReadOnly(true);//me permite editar 
            console.log("thread-", JSON.stringify(threadData.getThreadById))
            console.log("id", id)
        } else {
            setThread(undefined);
            setReadOnly(false);
        }
    }, [threadData]);

    //actualiza la categoria del formulario por medio del reducer de formulario local
    const receiveSelectedCategory = (cat: Category) => {
        threadReducerDispatcher({
            type: "category",
            payload: cat,
        });
    };

    //Las funciones receiveTitle y receiveBody también controlan las actualizaciones que se realizan en el título y el cuerpo desde sus respectivos componentes secundarios:
    //esta funcion se ejecuta desde el componente y actualiza el estado de la propiedad titulo rel reducers
    //en el copmponente titulo se actualiza este valor , se renderiza y el miemo tiempo lo actualiza aqui en el reducers
    const receiveTitle = (updatedTitle: string) => {
        threadReducerDispatcher({
            type: "title",
            payload: updatedTitle,
        });
    };

    const receiveBody = (body: Node[]) => {
        threadReducerDispatcher({
            type: "bodyNode",
            payload: body,
        });

        threadReducerDispatcher({
            type: "body",
            payload: getTextFromNodes(body),
        });
    };

    const onClickPost = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (!userId || userId === "0") {
            setPostMsg("Tiene que iniciar sesion para continuar.");

        } else if (!category) {
            setPostMsg("Seleccione una categoria para su Post.");

        } else if (!title) {
            setPostMsg("Ingrese in titulo.");

        } else if (!bodyNode) {
            setPostMsg("Seleccione una categoria para su Post.");

        } else {
            setPostMsg("");
            //los valores de estas propiedades se modifican en sus respectivos componentes hijos(que renderizan sus valores) por medio de las props.
            const newThread = {
                userId,
                categoryId: category?.id,
                title,
                body: JSON.stringify(bodyNode),
            };

            //elecuto la mutacion y le entrego las variables/objeto que contiene el nuevo thread
            const { data: createThreadMsg } = await execCreateThread({
                variables: newThread,
            });

            if (createThreadMsg.createThread && createThreadMsg.createThread.messages && !isNaN(createThreadMsg.createThread.messages[0])) {
                setPostMsg("Hilo posteado de forma correcta.");
                history.push(`/thread/${createThreadMsg.createThread.messages[0]}`);

            } else {
                //eobtengo mernsaje de error
                setPostMsg(createThreadMsg.createThread.messages[0]);
            }
        }
    };


    return (
        <div className="screen-root-container">
            <div className="thread-nav-container navigation">
                <Nav />
            </div>
            <div className="thread-content-container">
                <div className="thread-content-post-container">
                    {/*
                        ThreadHeader actúa como un componente de solo visualización.
                        Muestra el título del hilo,el nombre de usuario y el tiempo
                        trascurrido desde la modificacion.
                    */}
                    {width <= 768 && thread ? (
                        <ThreadPointsInline
                            points={thread?.points || 0}
                            threadId={thread?.id}
                            refreshThread={refreshThread}
                            allowUpdatePoints={true}
                        />
                    ) : null}
                    <ThreadHeader
                        userName={thread?.user.userName}
                        //lastModifiedOn no acepta null y en caso de serlo se envia la fecha actual
                        lastModifiedOn={thread ? thread.lastModifiedOn : new Date()}
                        title={thread?.title}
                    />
                    <ThreadCategory
                        category={thread?.category}
                        sendOutSelectedCategory={receiveSelectedCategory}
                    />
                    {
                        /*
                            <CategoryDropDown
                                navigate={false}
                                preselectedCategory={thread?.category}
                            />
                        */
                    }
                    <ThreadTitle
                        title={thread?.title}
                        readOnly={thread ? readOnly : false}
                        sendOutTitle={receiveTitle}
                    />
                    {/*Componente que contiene el editor de texto para la publicacion y edicion de thread*/}
                    <ThreadBody
                        body={thread?.body}
                        readOnly={readOnly}
                        sendOutBody={receiveBody}
                    />

                    {
                        thread
                            ? null
                            : (<>
                                <div style={{ marginTop: ".5em" }}>
                                    <button className="action-btn" onClick={onClickPost}> Post </button>
                                </div>
                                <strong>{postMsg}</strong>
                            </>)
                    }
                </div>
                <div className="thread-content-points-container">
                    {/*Contenido del card para los puntos donde aparece el icono del corazon y de los re-comentario del hilo o thread*/}
                    <ThreadPointsBar
                        points={thread?.points || 0}
                        responseCount={
                            thread && thread.threadItems && thread.threadItems.length
                        }
                        threadId={thread?.id || "0"}
                        allowUpdatePoints={true}
                        refreshThread={refreshThread}
                    />
                </div>
            </div>
            {thread ? (
                <div className="thread-content-response-container">
                    <hr className="thread-section-divider" />
                    <div style={{ marginBottom: ".5em" }}>
                        <strong>Post Response</strong>
                    </div>
                    <ThreadResponse
                        body={""}
                        userName={user?.userName}
                        lastModifiedOn={new Date()}
                        points={0}
                        readOnly={false}
                        threadItemId={"0"}
                        threadId={thread.id}
                        refreshThread={refreshThread}
                    />
                </div>
            ) : null}
            {thread ? (
                <div className="thread-content-response-container">
                    <hr className="thread-section-divider" />
                    <ThreadResponsesBuilder
                        threadItems={thread?.threadItems}
                        readOnly={readOnly}
                        refreshThread={refreshThread}
                    />
                </div>
            ) : null}
        </div>
    );
};

export default Thread;