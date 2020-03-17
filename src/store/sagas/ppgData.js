import { call, put } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga/effects';
import history from '../../history';

import ppgDataApi from '../api/ppgData';

import {
  setScans_,
  setScan_
} from '../actionCreators/ppgDataActions';

import {
  GET_USER_SCANS,
  GET_SCAN
} from '../reducers/ppgData';


import {
  setAlertMessage_,
  openToast_
} from '../actionCreators/appServiceActions';

import { goToPage_ } from '../actionCreators/routeActions';

function* getUserScans(action) {
  try {
    const data = yield call(ppgDataApi.getUserScans, action.data);
    if (data.success) {
      yield put(setScans_(data.scans));
    } else {
      yield put(setAlertMessage_(data.message, {}));
    }
  } catch (error) {
    yield put({ type: GET_USER_SCANS.FAILURE, error });
  }
}

function* getScan(action) {
  try {
    const data = yield call(ppgDataApi.getScan, action.data);
    if (data.success) {
      yield put(setScan_(data.scan));
    } else {
      yield put(setAlertMessage_(data.message, {}));
    }
  } catch (error) {
    yield put({ type: GET_USER_SCANS.FAILURE, error });
  }
}

export default [
  takeLatest(GET_USER_SCANS.REQUEST, getUserScans),
  takeLatest(GET_SCAN.REQUEST, getScan)
];
