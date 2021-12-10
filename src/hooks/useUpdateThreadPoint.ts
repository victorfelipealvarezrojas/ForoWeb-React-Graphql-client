import { gql, useMutation } from "@apollo/client";

//consulta graphql de que modifica los puntos de los thread
const UpdateThreadPoint = gql`
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
  }
`;

//este
const useUpdateThreadPoint = (
  refreshThread?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void,
  threadId?: string
) => {
  const [execUpdateThreadPoint] = useMutation(UpdateThreadPoint);

  const onClickIncThreadPoint = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.preventDefault();

    await execUpdateThreadPoint({
      variables: {
        threadId,
        increment: true,
      },
    });

    refreshThread && refreshThread(e);
  };

  const onClickDecThreadPoint = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.preventDefault();

    await execUpdateThreadPoint({
      variables: {
        threadId,
        increment: false,
      },
    });
    refreshThread && refreshThread(e);
  };

  return {
    onClickIncThreadPoint,
    onClickDecThreadPoint,
  };
};

export default useUpdateThreadPoint;
