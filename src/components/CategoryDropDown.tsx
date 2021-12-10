import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import DropDown, { Option } from "react-dropdown";
import Category from "../models/Category";
import { AppState } from "../store/AppState";

const defaultLabel = "Seleccione una categoria";
const defaultOption = {
    value: "0",
    label: defaultLabel
};

class CategoryDropDownProps {
    sendOutSelectedCategory?: (cat: Category) => void;//es una función pasada por el llamador primario que se utilizará para recibir la opción desplegable seleccionada por el elemento primario.
    navigate?: boolean = false;//permite navegar a la lsita de la categoria seleccionada
    preselectedCategory?: Category;//preselectedCategory permite al elemento primario forzar la lista desplegable para que haya seleccionado la ThreadCategory especificada en la carga
}

const CategoryDropDown: FC<CategoryDropDownProps> = ({ sendOutSelectedCategory, navigate, preselectedCategory, }) => {
    //obtengo la categoria del store de reducers(este reducers es llenado en el app.tsx)
    const categories = useSelector((state: AppState) => state.categories);
    //defino el hook que almacena valores del DropDown de categorias
    const [categoryOptions, setCategoryOptions] = useState<Array<string | Option>>([defaultOption]);
    //defino el hook que almacena el valor seleccionado del DropDown de categorias
    const [selectedOption, setSelectedOption] = useState<Option>(defaultOption);
    //lo usare para hacer renderizado de pagina con la opcion seleccionada del DropDown
    const history = useHistory();

    useEffect(() => {
        //si el categories(useSelector) me devuleve informacion
        if (categories) {
            //creo una nueva constante con sus valores por medio del map(catOptions retornara un array con el typado definido en su modelo value y label)
            const catOptions: Array<Option> = categories.map((cat: Category) => {
                return {
                    value: cat.id,
                    label: cat.name,
                };
            });
            //almaceno en el hook de categorias el array
            setCategoryOptions(catOptions);
            //seleccion desplegable predeterminada
            setSelectedOption({
                value: preselectedCategory
                    ? preselectedCategory.id
                    : "0",
                label: preselectedCategory
                    ? preselectedCategory.name
                    : defaultLabel,
            });
        }
    }, [categories, preselectedCategory]);

    //cuando se cambia de categoria
    const onChangeDropDown = (selected: Option) => {
        //modifico el hook de seleccion con el item seleccionado
        setSelectedOption(selected);
        //valida si se gatillo el evento desde el padre
        if (sendOutSelectedCategory) {
            //sendOutSelectedCategory es una función pasada por el llamador primario que se utilizará para recibir la opción desplegable seleccionada por el elemento primario
            sendOutSelectedCategory(new Category(selected.value, selected.label?.valueOf().toString() ?? ""));
        }
        //actualiza la vista en funcion de la categoria seleccionada si esta activada
        if (navigate) {
            history.push(`/categorythreads/${selected.value}`);
        }
    };

    return (
        <DropDown
            className="thread-category-dropdown"
            onChange={onChangeDropDown}
            options={categoryOptions}
            value={selectedOption}
            placeholder={defaultLabel}
        />
    );
};

export default CategoryDropDown;