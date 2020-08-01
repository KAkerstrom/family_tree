import authTypes from './authTypes';

const initialState = {
  user: null,
  authenticated: false,
  loading: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case authTypes.LOGIN_SUCCESS:
    case authTypes.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        authenticated: true,
      };

    case authTypes.LOAD_USER_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case authTypes.LOAD_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        authenticated: true,
      };

    case 'CLEAR_ALL':
    case authTypes.LOGOUT:
    case authTypes.REGISTER_FAILURE:
    case authTypes.LOGIN_FAILURE:
      return initialState;

    default:
      return state;
  }
};
