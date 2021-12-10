import Thread from "./Thread";
import ThreadItem from "./ThreadItem";

export default class User {
  constructor(
    public id: string,
    public email: string,
    public userName: string,
    public threads?: Array<Thread>,//?Necesitamos hacer esto para que podamos agregar una cuenta de usuario que aún no haya publicado nada
    public threadItems?: Array<ThreadItem>//?Necesitamos hacer esto para que podamos agregar una cuenta de usuario que aún no haya publicado nada
  ) {}
}
