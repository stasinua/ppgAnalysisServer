import { createStore, applyMiddleware } from 'redux';

import createSagaMiddleware from 'redux-saga';

import loadingActionMiddleware from './middleware/loadingActionMiddleware';

import appReducer from './reducers';

import rootSaga from './sagas';

export default () => {
  const middleware = [];
  middleware.push(loadingActionMiddleware);

  const sagaMiddleware = createSagaMiddleware();
  middleware.push(sagaMiddleware);
  const enhancer = applyMiddleware(...middleware);
  const store = createStore(appReducer, enhancer);

  sagaMiddleware.run(rootSaga);

  return store;
};
