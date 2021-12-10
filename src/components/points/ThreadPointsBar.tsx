import React, { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faReplyAll, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
//import { gql, useMutation } from "@apollo/client";
import useUpdateThreadPoint from "../../hooks/useUpdateThreadPoint";


//migre esta consulta graphql a un hook personalizado
/*const UpdateThreadPoint = gql`  
mutation UpdateThreadPoint(
    ##$userId: ID! ##no es necesario xq el usuario es obtenido de mi usuario en sesion desde el backend
    $threadId: ID! 
    $increment: Boolean!
) {    
    updateThreadPoint(      
        ##userId: $userId ##no es necesario xq el usuario es obtenido de mi usuario en sesion desde el backend     
        threadId: $threadId      
        increment: $increment    
    )  
}`;*/

//interface que define las props de el componente principal
/**export interface ThreadPointsBarProps {
    points: number;//puntos
    responseCount?: number;//cantidad de re-comentados
}*/

export class ThreadPointsBarProps {
    points: number = 0;//puntos
    responseCount?: number;//cantidad de re-comentados
    threadId?: string;//lo necesito para ejecutar la mutacion del graphQl
    allowUpdatePoints?: boolean = false;
    refreshThread?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;//actualiza thread por medio de esta funcion que se enceuntra ahi(thread) de esta forma aclueliza el conteo de puntos de esa pantalla
}

const ThreadPointsBar: FC<ThreadPointsBarProps> = ({ points, responseCount, threadId, allowUpdatePoints, refreshThread }) => {
    const { width } = useWindowDimensions();
    //const [ExecUpdateThreadPoint] = useMutation(UpdateThreadPoint);
    const { onClickDecThreadPoint, onClickIncThreadPoint }    = useUpdateThreadPoint(refreshThread,threadId  );
    /*
        Nota: useMutation no utiliza refetchQueries para actualizar el cliente de Apollo y refetchQueries obliga a que se vuelva a ejecutar cualquier consulta que se enumere en ella 
    */
    /*const onClickIncThreadPoint = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault();
        await ExecUpdateThreadPoint({
            variables: {
                threadId,
                increment: true,
            },
        });
        refreshThread && refreshThread(e);
    };

    const onClickDecThreadPoint = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault();
        await ExecUpdateThreadPoint({
            variables: {
                threadId,
                increment: false,
            },
        });
        refreshThread && refreshThread(e);
    };*/

    if (width >= 768) {
        return (
            <div className="threadcard-points">
                {/*Item de Likes con icono de corazon*/}
                <div className="threadcard-points-item">
                    <div
                        className="threadcard-points-item-btn"
                        style={{
                            display: `${allowUpdatePoints
                                ? "block"
                                : "none"}`
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faChevronUp}
                            className="point-icon"
                            onClick={onClickIncThreadPoint}
                        />
                    </div>
                    {points}
                    <div className="threadcard-points-item-btn"
                        style={{
                            display: `${allowUpdatePoints
                                ? "block"
                                : "none"}`
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faChevronDown}
                            className="point-icon"
                            onClick={onClickDecThreadPoint}
                        />
                    </div>
                    <FontAwesomeIcon icon={faHeart} className="points-icon" />
                </div>
                <div className="threadcard-points-item">
                    {responseCount}
                    <FontAwesomeIcon icon={faReplyAll} className="points-icon" />
                </div>
            </div>
        );
    }

    return null;
};

export default ThreadPointsBar;