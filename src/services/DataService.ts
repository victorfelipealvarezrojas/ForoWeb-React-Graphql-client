import Category from "../models/Category";
import CategoryThread from "../models/CategoryThread";
import Thread from "../models/Thread";
import User from "../models/User";

/*
const user = new User("1", "test1@test.com", "test1");

//obtiene una  una lista de categorias
export async function getCategories(): Promise<Array<Category>> {
  const promise = new Promise<Array<Category>>((res, rej) => {
    setTimeout(() => {
      const categories = [];

      const programming = new Category("1", "Programming");
      categories.push(programming);

      const cooking = new Category("2", "Cooking");
      categories.push(cooking);

      const sports = new Category("3", "Sports");
      categories.push(sports);

      const entertainment = new Category("4", "Entertainment");
      categories.push(entertainment);

      const travel = new Category("5", "Travel");
      categories.push(travel);

      res(categories);
    }, 2000);
  });
  return promise;
}

//obtiene hilos de categoria por Id y retorna un array de Thread(publicaciones o hilos de temas por categoria)
export async function getThreadsByCategory(
  catId: string
): Promise<Array<Thread>> {
  const promise = new Promise<Array<Thread>>((res, rej) => {
    setTimeout(() => {
      //creo una constante de tipo arreglo de hilos o thread
      const threads: Array<Thread> = [];
      //añado al array de hilos o temas  a la cosntante threads
      threads.push({
        id: "1",
        views: 22,
        title: "Thread 1",
        body: "GraphQL es un lenguaje de consulta y manipulación de datos para APIs, y un entorno de ejecución para realizar consultas con datos existentes. GraphQL fue desarrollado internamente por Facebook en 2012 antes de ser liberado públicamente en 2015. El …",
        user,
        points: 11,
        createdOn: new Date(),
        lastModifiedOn: new Date(),
        threadItems: [
          {
            id: "1",
            views: 22,
            points: 2,
            body: "ThreadItem 1",
            user,
            createdOn: new Date(),
            thread: "1",
          },
        ],
        category: new Category("1", "Programming"),
      });
      threads.push({
        id: "2",
        views: 2,
        title: "Thread 2",
        body: "Apollo es un conjunto de herramientas que permiten crear servidores GraphQL y también consumir APIs GraphQL. En este tutorial vamos a ver en detalle qué son y cómo se utilizan tanto Apollo Client como Apollo Server. Crearemos un pequeño proyecto de modo que, cuando termines este tutorial, puedas comenzar a utilizarlo con tus proyectos..",
        user,
        points: 55,
        createdOn: new Date(),
        lastModifiedOn: new Date(),
        threadItems: [
          {
            id: "1",
            views: 22,
            points: 2,
            body: "ThreadItem 1",
            user,
            createdOn: new Date(),
            thread: "2",
          },
        ],
        category: new Category("1", "Programming"),
      });
      threads.push({
        id: "3",
        views: 100,
        title: "Thread 3",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        user,
        points: 20,
        createdOn: new Date(),
        lastModifiedOn: new Date(),
        threadItems: [
          {
            id: "1",
            views: 22,
            points: 2,
            body: "ThreadItem 1",
            user,
            createdOn: new Date(),
            thread: "3",
          },
        ],
        category: new Category("1", "Programming"),
      });

      res(threads);
    }, 2000);
  });
  return promise;
}

//devuelve un listado de temas mas populares por categoria
export async function getTopCategories(): Promise<Array<CategoryThread>> {
  const promise = new Promise<Array<CategoryThread>>((res, rej) => {
    setTimeout(() => {
      const topCategories = [];

      const js = new CategoryThread(
        "1",
        "Programacion",
        "Cómo apredener JavaScript"
      );
      topCategories.push(js);

      const node = new CategoryThread(
        "2",
        "Programacion",
        "Cómo apredener Node"
      );
      topCategories.push(node);

      const react = new CategoryThread(
        "3",
        "Programacion",
        "Cómo apredener React"
      );
      topCategories.push(react);

      const french = new CategoryThread(
        "4",
        "Cocina",
        "Cómo aprendo la cocina francesa?"
      );
      topCategories.push(french);

      const italian = new CategoryThread(
        "5",
        "Cocina",
        "Cómo aprendo la cocina francesa 2?"
      );
      topCategories.push(italian);

      res(topCategories);
    }, 2000);
  });
  return promise;
}

//me devuelve un hilo o tema unico por Id
export async function getThreadById(Id: string): Promise<Thread> {
  const promise = new Promise<Thread>((res, rej) => {
    setTimeout(() => {
      const thread = {
        id: "1",
        views: 22,
        title: "Titulo del hilo o publicacion blah blah blah",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        user,
        points: 11,
        createdOn: new Date(),
        lastModifiedOn: new Date(),
        threadItems: [
          {
            id: "1",
            views: 22,
            points: 2,
            body: "ThreadItem 1",
            user,
            createdOn: new Date(),
            thread: "1",
          },
          {
            id: "2",
            views: 11,
            points: 14,
            body: "ThreadItem 2",
            user,
            createdOn: new Date(),
            thread: "1",
          },
        ],
        category: new Category("1", "Programación"),
      };

      res(thread);
    }, 2000);
  });
  return promise;
}

//me devuelve un hilo o tema unico por Id de usuario
export async function getUserThreads(id: string): Promise<Array<Thread>> {
  const result = new Promise<Array<Thread>>((res) => {
    setTimeout(() => {
      const threads: Array<Thread> = [];
      threads.push({
        id: "1",
        views: 22,
        title: "Thread 1",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        user,
        points: 11,
        createdOn: new Date(),
        lastModifiedOn: new Date(),
        threadItems: [
          {
            id: "1",
            views: 22,
            points: 2,
            body: "ThreadItem 1",
            user,
            createdOn: new Date(),
            thread: "1",
          },
        ],
        category: new Category("1", "Programming"),
      });
      threads.push({
        id: "2",
        views: 2,
        title: "Thread 2",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        user,
        points: 55,
        createdOn: new Date(),
        lastModifiedOn: new Date(),
        threadItems: [
          {
            id: "1",
            views: 22,
            points: 2,
            body: "ThreadItem 1",
            user,
            createdOn: new Date(),
            thread: "2",
          },
        ],
        category: new Category("1", "Programming"),
      });

      res(threads);
    }, 2000);
  });
  return result;
}



/*

            getUserThreads(user.id).then((items) => {
                const threadItemsInThreadList: Array<ThreadItem> = [];
                const threadList = items.map((th: Thread) => {
                    for (let i = 0; i < th.threadItems.length; i++) {
                        threadItemsInThreadList.push(th.threadItems[i]);
                    }

                    return (
                        <li key={`user-th-${th.id}`}>
                            <Link to={`/thread/${th.id}`} className="userprofile-link">
                                {th.title}
                            </Link>
                        </li>
                    );
                });
                setThreads(<ul>{threadList}</ul>);

                const threadItemList = threadItemsInThreadList.map((ti: ThreadItem) => (
                    <li key={`user-th-${ti.threadId}`}>
                        <Link to={`/thread/${ti.threadId}`} className="userprofile-link">
                            {ti.body}
                        </Link>
                    </li>
                ));
                setThreadItems(<ul>{threadItemList}</ul>);
            });

*/
