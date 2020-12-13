import constants from '../../constants.json';

const initialState = {
    navigator: null
};

const setNav = (state, action) => {
    return {
        ...state,
        navigator: action.payload.navigator
    };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constants.SET_ROOT_NAVIGATOR: return setNav(state, action);
        default:
            return state;
    }
};

export default reducer;