import React, { FC, useEffect, useState } from "react";

//interface que define las props
interface ThreadTitleProps {
    title?: string;
    readOnly: boolean;//de solo lectura cuando carguemos un thread existente
    sendOutTitle: (title: string) => void;
}

const ThreadTitle: FC<ThreadTitleProps> = ({ title, readOnly, sendOutTitle, }) => {

    const [currentTitle, setCurrentTitle] = useState("");

    useEffect(() => {
        setCurrentTitle(title || "");
    }, [title]);

    const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentTitle(e.target.value);// asigna el nuevo valor de titulo en el componente actual(variable local que ve reflejada el usuario)
        sendOutTitle(e.target.value);//funcion que permite hacer el cambio de valor del input en el reducer del componente padre
    };

    return (
        <div className="thread-title-container">
            <strong>Titulo</strong>
            <div className="field">
                <input
                    type="text"
                    value={currentTitle}
                    onChange={onChangeTitle}
                    readOnly={readOnly}
                />
            </div>
        </div>
    );
};

export default ThreadTitle;