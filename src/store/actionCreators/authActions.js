import {
  GET_USER_DATA,
  SET_USER_DATA_STATUS,
  SET_USER,
  SET_LOGGED_IN,
  LOG_IN,
  LOG_OUT
} from '../reducers/auth';

export function getUserData_() {
  return {
    type: GET_USER_DATA.REQUEST
  };
}

export function setUserDataStatus_(status) {
  return {
    type: SET_USER_DATA_STATUS,
    status: status
  };
}

export function setLoggedIn_(status) {
  return {
    type: SET_LOGGED_IN,
    status: status
  };
}

export function setUser_(user, newVitality) {
  window.localStorage.setItem(
    'user',
    JSON.stringify({
      _id: user._id
    })
  );
  return {
    type: SET_USER,
    user: user,
    newVitality: newVitality
  };
}

export function logIn_(name, uniqueIdentifier) {
  return {
    type: LOG_IN.REQUEST,
    data: {
      name,
      uniqueIdentifier
    }
  };
}

export function logOut_() {
  return {
    type: LOG_OUT.REQUEST
  };
}
