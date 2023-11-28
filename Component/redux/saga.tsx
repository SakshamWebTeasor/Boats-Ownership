import { takeEvery, put } from "redux-saga/effects";
import { SET_USER_DATA, USER_LIST } from "./constants";
import ApiLink from "../ApiLink";

function* SagaData() {
  yield takeEvery(USER_LIST, UserList);
}

function* UserList() {
  const url = ApiLink + "/users";
  let data = yield fetch(url);
  data = yield data.json();
  yield put({ type: SET_USER_DATA, data });
}

export default SagaData;
