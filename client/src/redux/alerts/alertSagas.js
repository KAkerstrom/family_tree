import { takeLatest, all } from 'redux-saga/effects';
import { setAlert, clearAlert } from './alertActions';
import alertTypes from './alertTypes';

function* setAlertWatcher() {
  yield takeLatest(alertTypes.SET_ALERT_ASYNC, setAlert);
}

function* clearAlertWatcher() {
  yield takeLatest(alertTypes.CLEAR_ALERT_ASYNC, clearAlert);
}

export default function* alertSaga() {
  yield all([setAlertWatcher(), clearAlertWatcher()]);
}
