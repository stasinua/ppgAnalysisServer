import { createAsyncAction, createReducer } from '../../helpers/redux';

export const USER_DATA_STATUS = {
  NOT_LOGGED_IN: 'notLoggedIn',
  LOGGED: 'success',
  LOADING: 'loading',
  NOTHING: ''
};

export const GET_USER_DATA = createAsyncAction('auth/GET_USER_DATA');
export const SIGN_UP = createAsyncAction('auth/SIGN_UP');
export const LOG_IN = createAsyncAction('auth/LOG_IN');
export const LOG_OUT = createAsyncAction('auth/LOG_OUT');
export const SET_USER_DATA_STATUS = 'auth/SET_USER_DATA_STATUS';
export const SET_USER = 'auth/SET_USER';
export const CLEAR_USER = 'auth/CLEAR_USER';
export const SET_LOGGED_IN = 'auth/SET_LOGGED_IN';

const initialState = {
  contactsList: {
    sortBy: 'created',
    contacts: [],
    contactsCount: 0
  },
  user: {
    _id: '',
    name: '',
    uniqueIdentifier: '',
    age: '',
    biologicalSex: '',
    lastVisit: Date(),
    vitalityLastVisit: new Date().toISOString()
  },
  disabled: false,
  loggedIn: false,
  userDataStatus: USER_DATA_STATUS.NOTHING
};

export default (state = initialState, action) => {

  switch (action.type) {
    case SIGN_UP.REQUEST:
      return {
        ...state,
        userDataStatus: USER_DATA_STATUS.LOADING
      };
    case LOG_IN.REQUEST:
      return {
        ...state,
        userDataStatus: USER_DATA_STATUS.LOADING
      };
    case SET_USER_DATA_STATUS:
      return Object.assign({}, state, {
        userDataStatus: action.status
      });
    case SET_USER:
    console.log(action.user);
      return Object.assign({}, state, {
        user: action.user
      });
    case CLEAR_USER:
      return Object.assign({}, state, {
        user: initialState.user
      });
    case SET_LOGGED_IN:
      return Object.assign({}, state, {
        loggedIn: action.status
      });
    case LOG_OUT.SUCCESS:
      return {
        ...state,
        userDataStatus: USER_DATA_STATUS.NOT_LOGGED_IN
      };
    default:
      return state;
  }
};
// export default createReducer(initialState, handlers);
