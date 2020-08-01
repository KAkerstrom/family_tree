import alertTypes from "./alertTypes";

export const setAlert = (message, variant = "danger", type = null) => ({
  type: alertTypes.SET_ALERT,
  payload: { message, variant, type },
});

export const clearAlert = () => ({
  type: alertTypes.CLEAR_ALERT,
});
