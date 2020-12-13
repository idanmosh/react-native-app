import constants from '../../constants.json';


const initialState = {
    user: {},
    loading: true
};

const setUser = (state, action) => {
    return {
        ...state,
        user: action.payload.user
    };
};

const setLoading = (state, action) => {
    return {
        ...state,
        loading: action.payload.loading
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constants.SET_USER: return setUser(state, action);
        case constants.SET_LOADING: return setLoading(state, action);
        default:
            return state;
    }
};

export default reducer;