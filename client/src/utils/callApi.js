import setAuthToken from './setAuthToken';
import { retry, put } from 'redux-saga/effects';
import axios from 'axios';

export default function* callApi({
  method,
  url,
  type,
  body,
  errorMessage,
  onSuccess,
}) {
  const config = { headers: { 'Content-Type': 'application/json' } };
  let error = null;
  try {
    setAuthToken(localStorage.token);
    let tries = 1;
    // if (method === 'post') tries = 1;
    // if (method === 'put') tries = 2;
    const res = yield retry(tries, 1000, axios, {
      method,
      url: process.env.REACT_APP_API_ENDPOINT + url,
      data: body,
      ...config,
    });
    const { errors, data } = res.data;
    if (!errors) {
      yield put({
        type: `${type}_SUCCESS`,
        payload: data,
      });
      if (onSuccess) onSuccess(data);
    } else {
      yield put({
        type: `${type}_FAILURE`,
        payload: {
          message: errors[0],
          variant: 'danger',
          type: `${type}_FAILURE`,
        },
      });
    }
  } catch (err) {
    // todo: err.response.data.msg
    console.error(err.message);
    yield put({
      type: `${type}_FAILURE`,
      payload: {
        message: errorMessage || 'Server error.',
        variant: 'danger',
        type: `${type}_FAILURE`,
      },
    });
  }
}
