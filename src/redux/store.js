import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import userReducer from './reducers/userReducer';
import cameraReducer from './reducers/cameraReducer';
import rootNavReducer from './reducers/rootNavReducer';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    userReducer,
    cameraReducer,
    rootNavReducer
});

const logger = store => {
    return next => {
        return action => {
            return next(action);
        };
    };
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(logger, thunk)));

export { store };