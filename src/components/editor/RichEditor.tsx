import React, { useState, useCallback, useMemo, useEffect, FC } from "react";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import { Editor, Transforms, createEditor, Node } from "slate";
import isHotkey from "is-hotkey";//herramienta que nos ayuda a crear atajos de teclado para nuestro editor.
import { withHistory } from "slate-history";//Lpermite al editor guardar las ediciones que se han producido, en el orden correcto, para que se puedan deshacer si es necesario.
import { Button, Toolbar } from "./RichTextControls";//componente que contiene controles que se pueden utilizar para crear la interfaz de usuario del editor
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBold,
    faItalic,
    faUnderline,
    faCode,
    faHeading,
    faQuoteRight,
    faListOl,
    faListUl,
} from "@fortawesome/free-solid-svg-icons";
import "./RichEditor.css";

//es un nuevo ayudante que permitirá que el formato Slate.js de nuestra matriz Node se traduzca en una cadena:
/*
  NOTA:
        Slate.js permite realizar un formato complejo en el texto de un usuario. Esta información es muy compleja y no se puede guardar como texto simple. 
        Por lo tanto, Slate.js utiliza objetos basados en el tipo de nodo en cuestión para almacenar este texto con formato. Cuando estos datos necesiten 
        ser almacenados en nuestra base de datos, primero tendremos que convertirlos en texto (JSON). Esto es parte de la razón por la que necesitamos 
        esta función getTextFromNodes.
 */
export const getTextFromNodes = (nodes: Node[]) => {
    return nodes.map((n: Node) => Node.string(n)).join("\n");
};

//diccionario que contiene las diversas teclas de método abreviado para formatear emparejamientos. [keyName: string] es la clave del diccionario
const HOTKEYS: { [keyName: string]: string } = {
    "mod+b": "bold",
    "mod+i": "italic",
    "mod+u": "underline",
    "mod+`": "code",
};

//El type paragraph es una matriz de nodos que proviene del editor Slate.js
//En Slate.js, el texto se representa como árboles jerárquicos de nodos, esto permite que la informacion de formato este junta con el texto(texto y metadatos juntos)
const initialValue = [{
    type: "paragraph",
    children: [{ text: "Ingresa tu publicación aquí." }],
}];

//se utiliza para distinguir si una entrada es un párrafo o una lista de texto.
const LIST_TYPES = ["numbered-list", "bulleted-list"];

//usaba una interface pero necesito definir un valor noarmal asi que la cambio a clase(xq las interface no permiten definir valores predeterminados)
class RichEditorProps {
    existingBody?: string;
    readOnly?: boolean = false;//la utilizare para indica que el contendiodo de las Thread luego de la publcacion sean solo de lectura
    /*
    Nota:
            Hemos agregado este *prop adicional para que cuando nuestro editor tenga su texto actualizado, 
            ese cambio subirá la jerarquía de componentes a nuestro componente Thread.tsx. Thread.tsx necesita 
            conocer el valor más reciente para poder enviarlo como parámetro cuando intenta crear un nuevo thread. 
            Repetiremos este patrón sendOut en estos componentes secundarios.
    */
    sendOutBody?: (body: Node[]) => void;
}

const RichEditor: FC<RichEditorProps> = ({ existingBody, readOnly, sendOutBody }) => {
    //el contenido del hook no es un texto plano, es un arbol jerarquico de tipado nodos(texto y metadatos)
    //value es un objeto de estado del tipo de matriz de nodo
    const [value, setValue] = useState<Node[]>(initialValue);
    //se usa internamente para renderizar piezas de texto más grandes(conjunto de texto de varias líneas)
    const renderElement = useCallback((props) => <Element {...props} />, []);
    //renderizar fragmentos de texto más pequeños. Una hoja es un pequeño fragmento de texto
    const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
    //El editor es el componente React que acepta y muestra el texto
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);

    //toma el elemento de cuerpo existente y lo convierte en el valor del estado local, este es cargado en la creacion de l componente por medio de las props
    //luego el valor cambiara desde el UI del editor de usuario sin ser gatillado por el useEffect(este useeffect solo es de modificacion inicial)
    useEffect(() => {
        console.log("existingBody", existingBody);
        if (existingBody) {
            // antes de que setValue pueda recibir estos datos, primero debe analizarse en formato JSON xq llegaran desde la base de datos 
            //y postgres no maneja esta estructura por eso se convierten a json
            setValue(JSON.parse(existingBody));
            //ahora estos valores llegaran desde la base de datos  en otro formato y necesito que esten en json
            /*setValue([
                {
                    type: "paragraph",
                    text: existingBody,
                },
            ]);*/
        }
        // eslint-disable-next-line 
    }, [existingBody]);

    //establece el estado del valor local cuando se cambia en la interfaz de usuario, el valor de texto es una matriz de tipo nodo
    //Aquí, hemos establecido nuestro val desde el editor, pero también lo hemos enviado de vuelta al componente principal usando sendOutBody.
    const onChangeEditorValue = (val: Node[]) => {
        setValue(val);
        sendOutBody && sendOutBody(val);
    };

    //componentes Slate, Toolbar y Editable, actúan como envoltorios alrededor del editor e inyectan o modifican el formato de texto para el
    return (
        //Inicializamos nuestro componente contenedor Slate con nuestra instancia de editor, el estado del valor local y el evento onChange
        <Slate editor={editor} value={value} onChange={onChangeEditorValue}>
            {/*contiene los formateadores principales, las teclas de método abreviado y la configuración básica de nuestro editor*/}
            {readOnly ? null : (
                <Toolbar>
                    <MarkButton format="bold" icon="bold" />
                    <MarkButton format="italic" icon="italic" />
                    <MarkButton format="underline" icon="underlined" />
                    <MarkButton format="code" icon="code" />
                    <BlockButton format="heading-one" icon="header1" />
                    <BlockButton format="block-quote" icon="in_quotes" />
                    <BlockButton format="numbered-list" icon="list_numbered" />
                    <BlockButton format="bulleted-list" icon="list_bulleted" />
                </Toolbar>
            )}
            {/*contiene la informacion de las publicaciones*/}
            <Editable
                className="editor"
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Ingresa su Post aquí."
                spellCheck
                autoFocus
                onKeyDown={(event) => {
                    for (const hotkey in HOTKEYS) {
                        if (isHotkey(hotkey, event as any)) {
                            event.preventDefault();
                            const mark = HOTKEYS[hotkey];
                            toggleMark(editor, mark);
                        }
                    }
                }}
                readOnly={readOnly}
            />
        </Slate>
    );
};

// es una función que genera la interfaz de usuario del botón y también asocia el formateador real que se activa cuando se hace clic en ese botón específico.
const MarkButton = ({ format, icon }: { format: string; icon: string }) => {
    const editor = useSlate();
    let thisIcon = faBold;
    if (icon === "italic") {
        thisIcon = faItalic;
    } else if (icon === "underlined") {
        thisIcon = faUnderline;
    } else if (icon === "code") {
        thisIcon = faCode;
    }
    return (
        <Button
            active={isMarkActive(editor, format)}
            onMouseDown={(event: any) => {
                event.preventDefault();
                toggleMark(editor, format);
            }}
        >
            <FontAwesomeIcon icon={thisIcon} />
        </Button>
    );
};

const isMarkActive = (editor: Editor, format: string) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
};

const toggleMark = (editor: Editor, format: string) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const BlockButton = ({ format, icon }: { format: string; icon: string }) => {
    const editor = useSlate();
    let thisIcon = faHeading;
    if (icon === "heading1") {
        thisIcon = faItalic;
    } else if (icon === "heading2") {
        thisIcon = faUnderline;
    } else if (icon === "in_quotes") {
        thisIcon = faQuoteRight;
    } else if (icon === "list_numbered") {
        thisIcon = faListOl;
    } else if (icon === "list_bulleted") {
        thisIcon = faListUl;
    }
    return (
        <Button
            active={isBlockActive(editor, format)}
            onMouseDown={(event: any) => {
                event.preventDefault();
                toggleBlock(editor, format);
            }}
        >
            <FontAwesomeIcon icon={thisIcon} />
        </Button>
    );
};

const isBlockActive = (editor: Editor, format: string) => {
    const [match] = Editor.nodes(editor, {
        match: (n) => n.type === format,
    });

    return !!match;
};

const toggleBlock = (editor: Editor, format: string) => {
    const isActive = isBlockActive(editor, format);
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
        match: (n) => LIST_TYPES.includes(n.type as string),
        split: true,
    });

    Transforms.setNodes(editor, {
        type: isActive ? "paragraph" : isList ? "list-item" : format,
    });

    if (!isActive && isList) {
        const block = { type: format, children: [] };
        Transforms.wrapNodes(editor, block);
    }
};

const Element = ({ attributes, children, element }: {
    attributes: any;
    children: any;
    element: any;
}) => {
    switch (element.type) {
        case "block-quote":
            return <blockquote {...attributes}>{children}</blockquote>;
        case "bulleted-list":
            return <ul {...attributes}>{children}</ul>;
        case "heading-one":
            return <h1 {...attributes}>{children}</h1>;
        case "heading-two":
            return <h2 {...attributes}>{children}</h2>;
        case "list-item":
            return <li {...attributes}>{children}</li>;
        case "numbered-list":
            return <ol {...attributes}>{children}</ol>;
        default:
            return <p {...attributes}>{children}</p>;
    }
};

const Leaf = ({
    attributes,
    children,
    leaf,
}: {
    attributes: any;
    children: any;
    leaf: any;
}) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }
    if (leaf.code) {
        children = <code>{children}</code>;
    }
    if (leaf.italic) {
        children = <em>{children}</em>;
    }
    if (leaf.underline) {
        children = <u>{children}</u>;
    }

    return <span {...attributes}>{children}</span>;
};

export default RichEditor;