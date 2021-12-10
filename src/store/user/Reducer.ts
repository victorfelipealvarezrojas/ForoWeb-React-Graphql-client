import User from "../../models/User";

//tipo de accion que permitira que UserProfileReducer pueda distinguirse de otros reductores
export const UserProfileSetType = "USER_PROFILE_SET";

//Estos son los datos que estarán en nuestras acciones cuando se envíen contiene el tipo y el payload que son los datos de la sesion.
export interface UserProfileAction {
    type: string;//indica el type de la accion
    payload: User | null;//payload sera el contenido de los datos que son de tipo User(payload es el estandar)
}

export const UserProfileReducer = (state: any = null, action: UserProfileAction): User | null => {
    switch (action.type) {
        case UserProfileSetType:
            return action.payload;
        default:
            return state;
    }
};