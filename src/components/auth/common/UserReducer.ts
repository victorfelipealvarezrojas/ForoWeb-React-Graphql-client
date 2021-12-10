const userReducer = (state: any, action: any) => {
  switch (action.type) {
    case "userName":
      return {
        ...state,
        userName: action.payload,
      };
    case "password":
      return {
        ...state,
        password: action.payload,
      };
    case "passwordConfirm":
      return {
        ...state,
        passwordConfirm: action.payload,
      };
    case "email":
      return {
        ...state,
        email: action.payload,
      };
    case "resultMsg":
      return {
        ...state,
        resultMsg: action.payload,
      };
    //deshabilitar botones en cualquier pantalla de autenticación
    case "isSubmitDisabled":
      return {
        ...state,
        isSubmitDisabled: action.payload,
      };
    default:
      return {
        ...state,
        resultMsg: "Ha ocurrido una falla.",
      };
  }
};

export default userReducer;
