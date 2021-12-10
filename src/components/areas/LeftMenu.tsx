import { useEffect, useState } from "react";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
//gql nos permite obtener resaltado y formato de sintaxis para consultas GraphQL
//UseQuery es un hook del lado cliente relacionado con GraphQL
import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import "./LeftMenu.css";

const GetAllCategories = gql`  
    query getAllCategories {    
        getAllCategories {      
            id      
            name    
        }  
}`;

const LeftMenu = () => {
    /*
        al desestructurar la respuesta del custom hook obtengo height,
        width que me indica si la ventana del navegador tiene un ancho <= 768px
    */
    const { loading, error, data } = useQuery(GetAllCategories);//hook del lado cliente relacionado con GraphQL
    const { width } = useWindowDimensions();

    //hook que almacenara la categorias a renderizar en el componente, es de tipo JSX.Element Div mientras no cargue su contenido
    //cuando finalice la carga y se actualice el hook pasara a ser un ul(Mostrara un menu)
    const [categories, setCategories] = useState<JSX.Element>(
        //texto predeterminado anterior a la carga de datos
        <div>Left Menu</div>
    );

    useEffect(() => {
        if (loading) {
            setCategories(<span>Loading ...</span>);
        } else if (error) {
            setCategories(<span>Error al cargar las Categorias...</span>);
        } else {
            if (data && data.getAllCategories) {
                const cats = data.getAllCategories.map((cat: any) => {
                    return <li  key={cat.id}>
                            <Link className="category" to={`/categorythreads/${cat.id}`}>{cat.name}</Link>
                           </li>;
                });
                setCategories(<ul >{cats}</ul>);
            }
        }
        //llamo al servicio encargado de listar las categorias
        /*getCategories()
            .then((categories: Array<Category>) => {
                //creo un nuevo arreglo con el contenido de categories,el valor devuelto sera un <Li> lo convertimos a jsx
                const cats = categories.map((cat) => {
                    //retorno un li con la estructura necesaria pasa ser renderizado en el HTML(key y descripcion)
                    return <li key={cat.id}>{cat.name}</li>;
                });
                //asigno a mi hook de tipo JSX.Element el contenido del menu(<Li>)
                setCategories(<ul className="category">{cats}</ul>);
            })
            .catch((err) => {
                console.log(err);
            });*/
            // eslint-disable-next-line 
    }, [data]);

    //si la pantalla actual es menor o igual a 768
    if (width <= 768) {
        return null;
    }

    return <div>{categories}</div>;
};

export default LeftMenu;