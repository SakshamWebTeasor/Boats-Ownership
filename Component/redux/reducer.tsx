import {
    APIKEY,
  LOGIN_SUCCESS,
  LOGOUT,
  SET_USER_DATA,
} from "./constants";

const initialState: any = [];

export const reducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case SET_USER_DATA:
      return [...state, action.data];
    case LOGIN_SUCCESS:
      return {
        ...state,
        userLoggedIn: action.payload,
      };
    case LOGOUT:
      console.log('logging out');
      return {
        ...state,
        userLoggedIn: null,
      };
    case APIKEY:
      return {
        ...state,
        ApiKey: action.payload,
      };
    default:
      return state;
  }
};
