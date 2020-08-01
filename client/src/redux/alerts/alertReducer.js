import alertTypes from "./alertTypes";

const initialState = {
  alert: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case alertTypes.SET_ALERT:
      return {
        ...state,
        alert: action.payload,
      };
    case alertTypes.CLEAR_ALERT:
      return {
        ...state,
        alert: null,
      };

    default:
      return state;
  }
};
