import { combineReducers } from 'redux';
import authReducer from './auth/authReducer';
import alertReducer from './alerts/alertReducer';
import relativeReducer from './relatives/relativeReducer';

export default combineReducers({
  auth: authReducer,
  alerts: alertReducer,
  relatives: relativeReducer,
});
