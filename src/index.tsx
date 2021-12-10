import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import configureStore from "./store/configureStore";
import ErrorBoundary from "./components/ErrorBoundary";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import "./index.css";

//consfiguro cliente GraphQL
const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql', //servidor
  credentials: "include",
  //establecemos el objeto de caché, Apolo almacena en caché todos los resultados de nuestra consulta
  cache: new InMemoryCache({
    //esta configuración deshabilita los resultados de la consulta para que no se almacenen en caché. Sin embargo, 
    //no lo hace por sí solo asi tenemos que agregar otra configuración a nuestras consultas.
    resultCaching: false,
  })
});

ReactDOM.render(
  <Provider store={configureStore()}>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <ErrorBoundary>{[<App key="App" />]}</ErrorBoundary>
      </ApolloProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

