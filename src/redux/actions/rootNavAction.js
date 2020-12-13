import constants from '../../constants.json';

export const setNav = navigator => {
    return {
        type: constants.SET_ROOT_NAVIGATOR,
        payload: { 
            navigator
        }
    };
};