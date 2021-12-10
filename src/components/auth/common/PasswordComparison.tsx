import React, { FC } from "react";
import { allowSubmit } from "./Helpers";
import {
    isPasswordValid,
    PasswordTestResult,
} from "../../../common/validators/PasswordValidator";

interface PasswordComparisonProps {
    dispatch: React.Dispatch<any>;//pasa desde el formulario padre el cual permite cambiar el estado del formulario para password
    password: string;
    passwordConfirm: string;
}

const PasswordComparison: FC<PasswordComparisonProps> = ({ dispatch, password, passwordConfirm }) => {
    const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        //dispatch asocia su reducer desde el padre
        dispatch({ 
            payload: e.target.value, 
            type: "password" 
        });
        const passwordCheck: PasswordTestResult = isPasswordValid(e.target.value);

        if (!passwordCheck.isValid) {
            allowSubmit(dispatch, passwordCheck.message, true);
            return;
        }
        passwordsSame(passwordConfirm, e.target.value);
    };
    const onChangePasswordConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ payload: e.target.value, type: "passwordConfirm" });
        passwordsSame(password, e.target.value);
    };
    const passwordsSame = (passwordVal: string, passwordConfirmVal: string) => {
        if (passwordVal !== passwordConfirmVal) {
            //recibe el dispatch por props y este dispatch indica que reducer es el que se esta trabajando actualmente
            //allowSubmit aqui modifico el reducer de tipo isSubmitDisabled que habilita o desabilita el boton de aceptar cambios en el fromulario padre
            allowSubmit(dispatch, "Contraseñas no son iguales", true);
            return false;
        } else {
            //en caso de no ocurrir error envio parametro en false que indica que no se bloquea el boton 
            allowSubmit(dispatch, "", false);
            return true;
        }
    };

    return (
        <React.Fragment>
            <div>
                <label>Contraseña</label>
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={onChangePassword}
                />
            </div>
            <div>
                <label>Conformacion Contraseña</label>
                <input
                    type="password"
                    placeholder="Confirmacion Contraseña"
                    value={passwordConfirm}
                    onChange={onChangePasswordConfirm}
                />
            </div>
        </React.Fragment>
    );
};

export default PasswordComparison;