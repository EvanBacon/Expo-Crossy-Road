import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
// import { autoRehydrate } from 'redux-persist';
import thunk from 'redux-thunk';

import reducer from '../reducers';

const logger = createLogger({
  // Only log in dev mode
  predicate: (getState, action) => process.env.NODE_ENV === `development`,
});

export default function configureStore(initialState) {
  const store = createStore(
    reducer,
    undefined,
    compose(applyMiddleware(thunk, logger)),
  );
  return store;
}
