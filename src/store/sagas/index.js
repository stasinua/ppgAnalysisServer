import { all } from 'redux-saga/effects';
import authSagas from './auth';
import ppgDataSagas from './ppgData';

export default function* rootSaga() {
  yield all([
    ...authSagas,
    ...ppgDataSagas
    // ...eventsSagas
  ]);
}
