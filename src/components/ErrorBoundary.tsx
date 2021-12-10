import React from "react";
import "./ErrorBoundary.css";

//tipado para los accesorios de nuestro límite de error llamado ErrorBoundaryProps
interface ErrorBoundaryProps {
    children: React.ReactNode[];
}

//estado local de nuestro límite de error llamado ErrorBoundaryState
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    info: object;
}

var err: Error | null;

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: new Error(),
            info: { componentStack: "" },
        };
    }

    //muestra el erro si el erro es verdadero
    static getDerivedStateFromError = (error: Error) => {
        return { hasError: true };
    };

    //función componentDidCatch donde nuestro componente se da cuenta de que ocurrió un error de algún tipo y
    //establece nuestra variable de estado hasError en verdadera
    componentDidCatch(error: Error | null, info: object) {
        err = error;
        this.setState({ hasError: true, error, info });
    }

    //se muestar el erro en caso de existir
    render() {
        if (this.state.hasError) {
            return (
                <div className="blue">
                    <section className="section hero no-margin">
                        <div className="hero-inner">
                            <h1>Error Interno, vuelva a cargar la pagina o intente mas tarde...{err?.message}</h1>
                        </div>
                    </section>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;