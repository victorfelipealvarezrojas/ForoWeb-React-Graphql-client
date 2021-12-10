import React, { useReducer, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
import userReducer from "../../auth/common/UserReducer";
import { AppState } from "../../../store/AppState";
import PasswordComparison from "../../auth/common/PasswordComparison";
import Thread from "../../../models/Thread";
import Nav from "../../areas/Nav";
import "./UserProfile.css";

const ChangePassword = gql`
  mutation ChangePassword($newPassword: String!){
    changePassword(newPassword: $newPassword)
  }
`;

const UserProfile = () => {
    const [
        { userName, password, passwordConfirm, resultMsg, isSubmitDisabled },
        dispatcher,//este dispatch me permite ejecutar los reducer de cambio de estado del formulario
    ] = useReducer(userReducer, {
        userName: "",
        password: "*********",
        passwordConfirm: "*********",
        resultMsg: "",
        isSubmitDisabled: true,
    });
    const user = useSelector((state: AppState) => state.user);
    console.log("userrrr",user?.threads)
    const [threads, setThreads] = useState<JSX.Element | undefined>();
    const [threadItems, setThreadItems] = useState<JSX.Element | undefined>();
    //hook para ejecutar mutacion de graphQL
    const [execChangePass] = useMutation(ChangePassword);

    useEffect(() => {
        if (user) {
            dispatcher({
                type: "userName",
                payload: user.userName,
            });

            console.log("threads",threads)

            const threadList = user?.threads?.map((th: Thread) => {
                console.log(th.id,th.title);
                return (
                    <li key={`user-th-${th.id}`}>
                    <Link to={`/thread/${th.id}`} className="userprofile-link">
                      {th.title}
                    </Link>
                  </li>
                )
            });
            setThreads(!user.threads || user.threads.length === 0
                ? undefined
                : (<ul>{threadList}</ul>)
            );

            const threadItemList = user.threadItems?.map((ti: any) => {
                return (
                    <li key={`user-ti-${ti.id}`}>
                        <Link to={`/thread/${ti.thread?.id}`} className="userprofile-link">
                            {ti.body.length <= 40 ? ti.body : ti.body.substring(0, 40) + " ..."}
                        </Link>
                    </li>
                )
            });
            setThreadItems(
                !user.threadItems || user.threadItems.length === 0 ? undefined : (
                    <ul>{threadItemList}</ul>
                )
            );
        } else {
            dispatcher({
                type: "userName",
                payload: "",
            });
            setThreads(undefined);
            setThreadItems(undefined);
        }
    }, [user]);

    const onClickChangePassword = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        //defino changePasswordData como alias para el resultado
        const { data: changePasswordData } = await execChangePass({
            variables: {
                newPassword: password,
            },
        });
        dispatcher({
            type: "resultMsg",
            payload: changePasswordData
                ? changePasswordData.changePassword
                : "",
        });
    };

    return (
        <div className="screen-root-container ">
            <div className="thread-nav-container">
                <Nav />
            </div>
            <form className="userprofile-content-container">
                <div>
                    <strong>Perfil del usuario: </strong>
                    <label style={{ marginLeft: ".75em" }}>{userName}</label>
                </div>
                <div className="userprofile-password">
                    <div>
                        {/*Los eventos de los controles en PasswordComparison se gatillan en el change*/}
                        <PasswordComparison
                            dispatch={dispatcher}
                            password={password}
                            passwordConfirm={passwordConfirm}
                        />
                        <button
                            className="action-btn"
                            disabled={isSubmitDisabled}
                            onClick={onClickChangePassword}
                        >
                            Cambiar Contraseña
                        </button>
                    </div>
                    <div style={{ marginTop: ".5em" }}>
                        <label>{resultMsg}</label>
                    </div>
                </div>
                <div className="userprofile-postings">
                    <hr className="thread-section-divider" />
                    <div className="userprofile-threads">
                        <strong>Publicaciones Principales</strong>
                        {threads}
                    </div>
                    <div className="userprofile-threadIems">
                        <strong>Publicaciones Secundarias</strong>
                        {threadItems}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UserProfile;