import { takeEvery, put } from "redux-saga/effects";
import { SET_USER_DATA, USER_LIST } from "./constants";
import ApiLink from "../ApiLink";

function* SagaData(): Generator {
  yield takeEvery(USER_LIST, UserList);
}

function* UserList(): Generator {
  const url: string = ApiLink + "/users";
  let data: any = yield fetch(url);
  data = yield data.json();
  yield put({ type: SET_USER_DATA, data });
}

export default SagaData;
