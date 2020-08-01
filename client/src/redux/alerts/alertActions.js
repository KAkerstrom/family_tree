import alertTypes from "./alertTypes";
import { put } from "redux-saga/effects";

export function* setAlert(action) {
  yield put({
    type: alertTypes.SET_ALERT,
    payload: action.payload,
  });
}

export function* clearAlert() {
  yield put({ type: alertTypes.CLEAR_ALERT });
}
