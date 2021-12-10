import { combineReducers } from "redux";
import { ThreadCategoriesReducer } from "./categories/Reducer";
import { UserProfileReducer } from "./user/Reducer";

export const rootReducer = combineReducers({
  categories: ThreadCategoriesReducer,
  user: UserProfileReducer,
});

//<typeof rootReducer> indica su tipado 
export type AppState = ReturnType<typeof rootReducer>;