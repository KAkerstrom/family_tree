import authTypes from './authTypes';

export const register = (name, email, password) => ({
  type: authTypes.REGISTER_REQUEST,
  payload: { name, email, password },
});

export const login = (email, password) => ({
  type: authTypes.LOGIN_REQUEST,
  payload: { email, password },
});

export const loadUser = () => ({
  type: authTypes.LOAD_USER_REQUEST,
});

export const logout = () => ({
  type: authTypes.LOGOUT_ASYNC,
});
