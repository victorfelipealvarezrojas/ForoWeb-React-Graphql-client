import { Dispatch } from "react";

//esta funcion gatillara los reducer correspondientes que permitiran abilitar o desabilitra el submit de un formulario,
//ademas de desplegar un mensaje de error por medio del reducer
export const allowSubmit = (dispatch: Dispatch<any>, msg: string, setDisabled: boolean) => {
    //dispatch le indica cual es el reducer al cual tiene que hacer referencia y es indicado desde el consumidor del helpers
    dispatch({
        type: "isSubmitDisabled",
        payload: setDisabled
    });

    dispatch({
        type: "resultMsg",
        payload: msg,
    });
};