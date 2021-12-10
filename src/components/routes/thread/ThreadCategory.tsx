import React, { FC, useEffect, useState } from "react";
import DropDown, { Option } from "react-dropdown";
import { useSelector } from "react-redux";
import Category from "../../../models/Category";
import { AppState } from "../../../store/AppState";
import "react-dropdown/style.css";
import CategoryDropDown from "../../CategoryDropDown";

//interface que reprecenta el tipado de las props en la desestructuracion de estas en el componente principal
interface ThreadCategoryProps {
    category?: Category;
    sendOutSelectedCategory: (cat: Category) => void;//categoria seleccionada
}

const ThreadCategory: FC<ThreadCategoryProps> = ({ category, sendOutSelectedCategory }) => {
    //let catOptions: Array<Option> = [];
    //let defaultOption = catOptions[2];
    //obtengo la categoria del store de reducers(este reducers es llenado en el app.tsx)
    //const categories = useSelector((state: AppState) => state.categories);
    //defino el hook que almacena valores del DropDown de categorias
    //const [categoryOptions, setCategoryOptions] = useState<Array<string | Option>>([defaultOption]);
    /*const sendOutSelectedCategory = (cat: Category) => {
        console.log("Seleccione Categoria", cat);
    };/*
    /*
     funcuionalidad antigua   
     useEffect(() => {
        if (categories) {
            catOptions = categories.map((cat: Category) => {
                return {
                    value: cat.id,
                    label: cat.name,
                };
            });
            setCategoryOptions(catOptions);
        }
    }, []);
    const onChangeDropDown = (arg: Option) => {
        console.log(arg);
    };
*/
    return (
        <div className="thread-category-container">
            <strong>{category?.name}</strong>
            <div style={{ marginTop: "1em" }}>
                <CategoryDropDown
                    preselectedCategory={category}//la categorias seleccionada desde el componente padre
                    sendOutSelectedCategory={sendOutSelectedCategory}//categoria cambio de seleccion, envia la nueva seleccion a CategoryDropDown evento de cambio
                />
            </div>
        </div>
    );
};

export default ThreadCategory;