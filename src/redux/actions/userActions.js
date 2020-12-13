import constants from '../../constants.json';

export const setUser = user => {
    return {
        type: constants.SET_USER,
        payload: { 
            user
        }
    };
};

export const setLoading = loading => {
    return {
        type: constants.SET_LOADING,
        payload: { 
            loading
        }
    }
}