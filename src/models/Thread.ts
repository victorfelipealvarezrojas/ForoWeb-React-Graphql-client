import Category from "./Category";
import ThreadItem from "./ThreadItem";
import User from "./User";

//publicacion inicial
export default class Thread {
  constructor(
    public id: string,
    public views: number,
    public title: string,
    public body: string,
    public user: User,
    public points: number,//numero total de me gusta
    public createdOn: Date,
    public lastModifiedOn: Date,
    public threadItems: Array<ThreadItem>,//respuestas
    public category: Category
  ) {}
}