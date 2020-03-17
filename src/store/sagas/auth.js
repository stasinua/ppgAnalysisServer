import { call, put } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga/effects';
import history from '../../history';

import authApi from '../api/auth';

import {
  setLoggedIn_,
  setUser_,
  setUserDataStatus_
} from '../actionCreators/authActions';

import {
  getUserScans_,
} from '../actionCreators/ppgDataActions';

import {
  GET_USER_DATA,
  SET_USER,
  LOG_IN,
  LOG_OUT
} from '../reducers/auth';


import {
  setAlertMessage_,
  openToast_
} from '../actionCreators/appServiceActions';

import { goToPage_ } from '../actionCreators/routeActions';

function* getUserData(action) {
  try {
    const data = yield call(authApi.getUserData, action.data);
    if (data.success) {
      yield put(setLoggedIn_(true));
      yield put(setUser_(data.user));
      yield put(setUserDataStatus_('success'));
    } else {
      yield put(setAlertMessage_(data.message, {}));
    }
  } catch (error) {
    yield put({ type: GET_USER_DATA.FAILURE, error });
  }
}

function* logIn(action) {
  try {
    const data = yield call(authApi.logIn, action.data);
    if (data.success) {
      window.localStorage.setItem('userToken', data.token);
      yield put(openToast_(data.message, {}));
      yield put(goToPage_('ppgData'));
      yield put(setLoggedIn_(true));
      yield put(setUserDataStatus_('success'));
      yield put(setUser_(data.user));
      yield put(getUserScans_(data.user._id));
    } else {
      yield put(setUserDataStatus_('notLoggedIn'));
      yield put(setAlertMessage_(data.message, {}));
    }
  } catch (error) {
    yield put({ type: LOG_IN.FAILURE, error });
  }
}

function* logOut(action) {
  try {
    const data = yield call(authApi.logOut, action.data);
    localStorage.clear();
    if (data.success) {
      yield put(goToPage_('login'));
      yield put(setLoggedIn_(false));
      yield put(setUserDataStatus_('notLoggedIn'));
    } else {
      yield put(setAlertMessage_(data.message, {}));
    }
  } catch (error) {
    yield put({ type: LOG_OUT.FAILURE, error });
  }
}

export default [
  takeLatest(GET_USER_DATA.REQUEST, getUserData),
  takeLatest(LOG_IN.REQUEST, logIn),
  takeLatest(LOG_OUT.REQUEST, logOut)
];
