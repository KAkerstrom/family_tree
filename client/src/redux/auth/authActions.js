import store from '../rootStore';
import setAuthToken from '../../utils/setAuthToken';
import callApi from '../../utils/callApi';

export function* loadUser() {
  yield callApi({
    method: 'get',
    url: '/auth',
    type: 'LOAD_USER',
    errorMessage: "There was an error while getting the user's profile.",
  });
}

export function* register(action) {
  yield callApi({
    method: 'post',
    url: '/users',
    type: 'REGISTER',
    body: action.payload,
    errorMessage: 'Registration failed.',
    onSuccess: (token) => localStorage.setItem('token', token),
  });
}

export function* login(action) {
  yield callApi({
    method: 'post',
    url: '/auth',
    type: 'LOGIN',
    body: action.payload,
    errorMessage: 'Login failed.',
    onSuccess: (token) => localStorage.setItem('token', token),
  });
}

export function* logout() {
  setAuthToken(null);
  localStorage.removeItem('token');
  yield store.dispatch({ type: 'CLEAR_ALL' });
}
