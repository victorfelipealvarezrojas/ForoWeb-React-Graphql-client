import { gql, QueryLazyOptions, useLazyQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { UserProfileSetType } from "../store/user/Reducer";

export const Me = gql`
  query me {
    me {
      ... on EntityResult {
        messages
      }
      ... on User {
        id
        userName
        threads {
          id
          title
        }
        threadItems {
          id
          thread {
            id
          }
          body
        }
      }
    }
  }
`;

//intyerface que utilizo para definir los valores de retorno de mi hook personalizado
//execMe ejecuta la consulta de graphql desde componente que implemente este hook(retorna el usuario de sesion)
//deleteMe elimina el usuario del store desde componente que implemente este hook
//updateMe actualiza el usuario del store desde componente que implemente este hook
interface UseRefreshReduxMeResult {
  execMe: (options?: QueryLazyOptions<Record<string, any>> | undefined) => void;
  deleteMe: () => void;
  updateMe: () => void;
}

const useRefreshReduxMe = (): UseRefreshReduxMeResult => {
  //useLazyQuery que permite que la query de graphql s eejecute a peticion
  //execMe me permite ejecutar la query, data es el resultado de la query
  const [execMe, { data }] = useLazyQuery(Me);
  //me permite acceder al store de reducer para manipularlo
  const reduxDispatcher = useDispatch();
  //elimina el usuario del store
  const deleteMe = () => {
    reduxDispatcher({
      type: UserProfileSetType,
      payload: null,
    });
  };

  //actualiza el usuario del store
  const updateMe = () => {
    if (data && data.me && data.me.userName) {
      console.log("data.me",data.me)
      reduxDispatcher({
        type: UserProfileSetType,
        payload: data.me,
      });
    }
  };

  return {
    execMe,
    deleteMe,
    updateMe,
  };
};
export default useRefreshReduxMe;
