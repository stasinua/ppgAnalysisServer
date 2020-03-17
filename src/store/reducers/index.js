import { combineReducers } from 'redux';

import appServiceReducer from './appService';
import authReducer from './auth';
import ppgDataReducer from './ppgData';

const appReducer = combineReducers({
  appServiceReducer,
  authReducer,
  ppgDataReducer
});
const rootReducer = (state, action) => {
  if (action.type === 'LOG_OUT') {
    state = undefined; //clear state when user log out
  }
  return appReducer(state, action);
};

export default rootReducer;
