import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from '../reducers'
import createLogger from 'redux-logger';

export default function configureStore(initialState) {
  const createStoreWithMiddleware = applyMiddleware(thunk, createLogger)(createStore);
  const store = createStoreWithMiddleware(reducer);
  return store
}
