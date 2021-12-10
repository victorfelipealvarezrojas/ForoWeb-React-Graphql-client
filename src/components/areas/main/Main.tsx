import React, { useEffect, useState } from "react";
import MainHeader from "./MainHeader";
import ThreadCard from "./ThreadCard";
import Category from "../../../models/Category";
//gql nos permite obtener resaltado y formato de sintaxis para consultas GraphQL
//UseQuery es un hook del lado cliente relacionado con GraphQL
import { gql, useLazyQuery } from "@apollo/client";
import { useHistory, useParams } from "react-router-dom";

const GetThreadsByCategoryId = gql`  
  query getThreadsByCategoryId($categoryId: ID!) {    
    getThreadsByCategoryId(categoryId: $categoryId) {      
      ... on EntityResult {        
        messages      
      }      
      ... on ThreadArray {        
        threads {          
          id          
          title          
          body 
          views          
          points  
          user{
            userName
          }       
          threadItems {            
            id          
          }          
          category {            
            id            
            name          
          }        
        }     
      }    
    }  
  }`;

const GetThreadsLatest = gql`  
  query getThreadsLatest {    
    getThreadsLatest {      
      ... on EntityResult {        
        messages      
      }      
      ... on ThreadArray {        
        threads {          
          id          
          title          
          body          
          views   
          user{
            userName
          }          
          threadItems {            
            id          
          }          
          category {            
            id            
            name          
          }        
        }      
      }    
    }  
 }`;

const Main = () => {
  const history = useHistory();//me permite hacer los cambios de url
  //const { categoryId } = useParams();
  //no se ejecutan inmediatamente, a diferencia de useQuery, y solo se ejecutan cuando se realizan las llamadas execGetThreadsByCat o execGetThreadsLatest.
  //error: threadsByCatErr,{ data: threadsByCatData }      
  //called: threadsByCatCalled,    
  const [execGetThreadsByCat, { data: threadsByCatData }] = useLazyQuery(GetThreadsByCategoryId);
  //error: threadsLatestErr, { data: threadsByCatData }     
  //called: threadsLatestCalled,    
  const [execGetThreadsLatest, { data: threadsLatestData }] = useLazyQuery(GetThreadsLatest);
  //parametro que lleag desde al URL(puede venir o no)
  const { categoryId } = useParams<any>();
  const [category, setCategory] = useState<Category | undefined>();
  const [threadCards, setThreadCards] = useState<Array<JSX.Element> | null>(
    null
  );

  //##const history = useHistory();
  //hook que ejecuta mi consulta 
  useEffect(() => {
    if (categoryId && categoryId > 0) {
      execGetThreadsByCat({
        variables: {
          categoryId,
        },
      });
    } else {
      execGetThreadsLatest();//las ultimas publicaciones 
    }
    // eslint-disable-next-line 
  }, [categoryId]);

  /*
    Nota: los siguentes Hook useEffect se gatillan dependiendo de si llegan en las prop el id de la categoria en especifico o no(categoryId)
          este Id es pasado por url en el componente app.tsx(/categorythreads/:categoryId) y asi obtener la informacion de l Thread que  sera 
          pasada por props a ThreadCaed.tsx el cual despliega la info del Thread y genera un link de redireccion por Id de categoria sobre este mismo
          componnete que tiene definiodo las rutas '/' y '/categorythreads/:categoryId' en el app.tsx para el Home
  */

  //este useEffect se gatilla cuando execGetThreadsByCat retoprna threadsByCatData(data de la respuesta)
  useEffect(() => {
    if (
      threadsByCatData &&//threadsByCatData es el alias que le di al retorno de la funcion(data)
      threadsByCatData.getThreadsByCategoryId &&
      threadsByCatData.getThreadsByCategoryId.threads//si retorno threads es xq contiene informacion de lo contrario no existiria
    ) {
      const threads = threadsByCatData.getThreadsByCategoryId.threads;//obtengo el resultado d ela respuesta
      const cards = threads.map((th: any) => {
        return <ThreadCard key={`thread-${th.id}`} thread={th} />;
      });
      //agrego categoria seleccionda, la usare para poner en el titulo la categoria seleccionada
      //en caso de ser resolucion mobile el componente que despega esta informacion no sera visible
      setCategory(threads[0].category);//programcion, cocina,finanzas ,etc
      setThreadCards(cards);
    } else {
      setCategory(undefined);
      setThreadCards(null);
    }
  }, [threadsByCatData]);

  //este hook se gatilla con el resultado de la funcion execGetThreadsLatest que se encarga de listar los ultimos thread publicados
  useEffect(() => {
    if (
      threadsLatestData &&
      threadsLatestData.getThreadsLatest &&
      threadsLatestData.getThreadsLatest.threads
    ) {
      const threads = threadsLatestData.getThreadsLatest.threads;
      const cards = threads.map((th: any) => {
        return <ThreadCard key={`thread-${th.id}`} thread={th} />;
      });

      setCategory(new Category("0", "Publicaciones más recientes"));
      setThreadCards(cards);
    }
  }, [threadsLatestData]);

  const onClickPostThread = () => {
    history.push("/thread/");
  };

  return (
    <main className="content">
      <button className="action-btn" onClick={onClickPostThread}>
        Post
      </button>
      {/*Tutulo o DropDown de la categoria, se visualizaran dependiendo de la resolucion uno o el otro */}
      <MainHeader category={category} />
      {/*render del componente card con las publicaciones por medio de un hook de tipo JSX */}
      <div>{threadCards}</div>
    </main>
  );
};

export default Main;