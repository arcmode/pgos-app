import { createStore, Store, AnyAction } from 'redux';
import { reducer, State } from './reducer';

interface WindowWithRedux extends Window {
  __REDUX_DEVTOOLS_EXTENSION__: Function;
}

export const store: Store<State, AnyAction> = createStore(
  reducer,
  (window as WindowWithRedux).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as WindowWithRedux).__REDUX_DEVTOOLS_EXTENSION__(),
);
