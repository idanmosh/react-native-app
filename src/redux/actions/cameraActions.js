import constants from '../../constants.json';

export const addCamera = camera => {
    return {
        type: constants.ADD_CAMERA,
        payload: { 
            camera
        }
    };
};

export const addDot = dot => {
    return {
        type: constants.ADD_DOT,
        payload: {
            dot
        }
    };
}

export const removeDot = () => {
    return {
        type: constants.REMOVE_DOT
    };
}

export const saveArea = (size) => {
    return {
        type: constants.SAVE_AREA,
        payload: {
            size
        }
    };
}

export const clearCameraArr = () => {
    return {
        type: constants.CLEAR_CAMERA_ARR
    };
}

export const removeAllDots = () => {
    return {
        type: constants.REMOVE_ALL_DOTS
    };
}

export const updateCamera = camera => {
    return {
        type: constants.UPDATE_CAMERA,
        payload: {
            camera
        }
    };
}

export const removeCamera = camera => {
    return {
        type: constants.REMOVE_CAMERA,
        payload: {
            camera
        }
    };
}

export const insertCameras = cameras => {
    return {
        type: constants.INSERT_CAMERAS,
        payload: {
            cameras
        }
    };
}

export const insertCurrCamera = camera => {
    return {
        type: constants.INSERT_CURR_CAMERA,
        payload: {
            camera
        }
    };
}

export const insertScreen = screen => {
    return {
        type: constants.INSERT_SCREEN,
        payload: {
            screen
        }
    };
}