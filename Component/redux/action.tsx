import { User } from "@/pages/Users";
import {
  USER_LIST,
  LOGIN_SUCCESS,
  LOGOUT,
  APIKEY
} from "./constants";

export const loginSuccess = (user: User) => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const logout = () => ({
  type: LOGOUT,
});

export function getUserList() {
  return {
    type: USER_LIST,
  };
}

export function setApiKey(key:string) {
    return {
        type: APIKEY,
        payload:key
    }
}
