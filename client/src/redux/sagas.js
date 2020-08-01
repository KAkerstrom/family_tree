import { all } from 'redux-saga/effects';
import authSagas from './auth/authSagas';
import alertSagas from './alerts/alertSagas';
import relativeSagas from './relatives/relativeSagas';

export default function* rootSaga() {
  yield all([authSagas(), alertSagas(), relativeSagas()]);
}
