import React, { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { gql, useMutation } from "@apollo/client";
import "./ThreadPointsInline.css";
import useUpdateThreadPoint from "../../hooks/useUpdateThreadPoint";

const UpdateThreadItemPoint = gql`
  mutation UpdateThreadItemPoint(
    ##$userId: ID! No lo necesito la consulta grapql obtiende de forma interna el user en sesion
    $threadItemId: ID!    
    $increment: Boolean!
  ){
    updateThreadItemPoint(
      ##userId: $userId  No lo necesito la consulta grapql obtiende de forma interna el user en sesion
      threadItemId: $threadItemId
      increment: $increment
    )
  }
`;

class ThreadPointsInlineProps {
  points: number = 0;
  threadId?: string;
  threadItemId?: string;
  allowUpdatePoints?: boolean = false;
  refreshThread?: () => void;
}

const ThreadPointsInline: FC<ThreadPointsInlineProps> = ({
  points,
  threadId,
  threadItemId,
  allowUpdatePoints,
  refreshThread,
}: ThreadPointsInlineProps) => {

  const [execUpdateThreadItemPoint] = useMutation(UpdateThreadItemPoint);

  const { onClickDecThreadPoint, onClickIncThreadPoint } = useUpdateThreadPoint(refreshThread, threadId);

  //Evento que actualiza los puntos de los threadItems(sub hilos) like 
  const onClickIncThreadItemPoint = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();
    await execUpdateThreadItemPoint({
      variables: {
        threadItemId,
        increment: true,
      },
    });
    refreshThread && refreshThread();
  };

  //Evento que actualiza los puntos de los threadItems(sub hilos) decremento 
  const onClickDecThreadItemPoint = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();
    const result = await execUpdateThreadItemPoint({
      variables: {
        threadItemId,
        increment:
          false,
      },
    });
    refreshThread && refreshThread();
  };

  return (
    <span className="threadpointsinline-item">
      <div
        className="threadpointsinline-item-btn"
        style={{
          display: `${allowUpdatePoints
            ? "block"
            : "none"}`
        }} >
        <FontAwesomeIcon
          icon={faChevronUp}
          className="point-icon"
          onClick={threadId ? onClickIncThreadPoint : onClickIncThreadItemPoint}
        />
      </div>
      {points}
      <div
        className="threadpointsinline-item-btn"
        style={{
          display: `${allowUpdatePoints
            ? "block"
            : "none"}`
        }}
      >
        <FontAwesomeIcon
          icon={faChevronDown}
          className="point-icon"
          onClick={threadId ? onClickDecThreadPoint : onClickDecThreadItemPoint}
        />
      </div>
      <div className="threadpointsinline-item-btn">
        <FontAwesomeIcon
          icon={faHeart}
          className="points-icon"
        />
      </div>
    </span>
  );
};

export default ThreadPointsInline;