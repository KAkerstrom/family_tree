import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducer from './rootReducer.js';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

const store =
  process.env.NODE_ENV === 'production'
    ? createStore(reducer, applyMiddleware(sagaMiddleware))
    : createStore(
        reducer,
        composeWithDevTools(applyMiddleware(sagaMiddleware))
      );

sagaMiddleware.run(rootSaga);

export default store;
