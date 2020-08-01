import authTypes from './authTypes';
import { takeLatest, all } from 'redux-saga/effects';
import { login, logout, register, loadUser } from './authActions';

export default function* authSagas() {
  yield all([
    yield takeLatest(authTypes.LOAD_USER_REQUEST, loadUser),
    yield takeLatest(authTypes.REGISTER_REQUEST, register),
    yield takeLatest(authTypes.LOGIN_REQUEST, login),
    yield takeLatest(authTypes.LOGOUT_ASYNC, logout),
  ]);
}
