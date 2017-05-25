import { compose, createStore, applyMiddleware } from 'redux'
import {AsyncStorage} from 'react-native';
import thunk from 'redux-thunk'
import reducer from '../reducers'
import {createLogger} from 'redux-logger';
import {autoRehydrate} from 'redux-persist'


const logger = createLogger({
  // Only log in dev mode
  predicate: (getState, action) => process.env.NODE_ENV === `development`
});


export default function configureStore(initialState) {
  const store = createStore(
    reducer,
    undefined,
    compose(
      applyMiddleware(thunk, logger),
      autoRehydrate()
    )
  );
  return store
}


// export default function configureStore(initialState) {
//   const createStoreWithMiddleware = applyMiddleware(thunk, createLogger)(createStore);
//   const store = createStoreWithMiddleware(reducer);
//   return store
// }
