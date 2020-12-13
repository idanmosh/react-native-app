import constants from '../../constants.json';

const initialState = {
    cameras: [],
    dots: [],
    lines1: [],
    lines2: [],
    areas: [],
    currCamera: {}, 
    screen: ''
};

const addCamera = (state, action) => {
    const newCamera = action.payload.camera;
    return {
        ...state,
        cameras: [...state.cameras, newCamera]
    };
};

const updateCamera = (state, action) => {
    const updatedCamera = action.payload.camera;
    const newCameras = state.cameras.map(camera => 
        (camera._id === updatedCamera._id ? updatedCamera : camera)
    );
    return {
        ...state,
        cameras: [...newCameras]
    };
};

const removeCamera = (state, action) => {
    const removedCamera = action.payload.camera;
    const newCameras = state.cameras.filter(camera => 
        camera._id !== removedCamera._id
    );
    return {
        ...state,
        cameras: [...newCameras]
    };
};

const insertCameras = (state, action) => {
    return {
        ...state,
        cameras: action.payload.cameras
    };
};

const insertCurrCamera = (state, action) => {
    return {
        ...state,
        currCamera: action.payload.camera
    };
}

const addDot = (state, action) => {
    const newDot = action.payload.dot;
    return {
        ...state,
        dots: [...state.dots, newDot]
    };
}

const removeDot = (state, action) => {
    state.dots.pop();
    return {
        ...state,
        dots: [...state.dots]
    };
}

const removeAllDots = (state, action) => {
    return {
        ...state,
        dots: [],
        lines1: [],
        lines2: [],
        areas: [],
        currCamera: {}
    };
}

const saveArea = (state, action) => {
    const linesArr = [];
    for(let i = 0; i < state.dots.length; i++) {
        if(i < state.dots.length-1) {
            linesArr.push({ 
                X1: state.dots[i].X,
                Y1: state.dots[i].Y,
                X2: state.dots[i+1].X,
                Y2: state.dots[i+1].Y 
            });
        }
        else {
            linesArr.push({ 
                X1: state.dots[i].X,
                Y1: state.dots[i].Y,
                X2: state.dots[0].X,
                Y2: state.dots[0].Y 
            });
        }
    }

    if(state.areas.length === 0) {
        return {    
            ...state,
            lines1: [...linesArr],
            areas: [...state.areas, state.dots],
            dots: []
        };
    }
    else {
        return {    
            ...state,
            lines2: [...linesArr],
            areas: [
                    ...state.areas, 
                    state.dots,
                    [{ width: action.payload.size.width, 
                       height: action.payload.size.height }]
                   ],
            dots: []
        };
    }
}

const clearCameraArr = (state, action) => {
    return {
        ...state,
        dots: [],
        lines1: [],
        lines2: [],
        areas: [],
    };
}

const insertScreen = (state, action) => {
    return {
        ...state,
        screen: action.payload.screen
    };
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case constants.ADD_CAMERA: return addCamera(state, action);
        case constants.UPDATE_CAMERA: return updateCamera(state, action);
        case constants.REMOVE_CAMERA: return removeCamera(state, action);
        case constants.INSERT_CAMERAS: return insertCameras(state, action);
        case constants.INSERT_CURR_CAMERA: return insertCurrCamera(state, action);
        case constants.ADD_DOT: return addDot(state, action);
        case constants.REMOVE_DOT: return removeDot(state, action);
        case constants.REMOVE_ALL_DOTS: return removeAllDots(state, action);
        case constants.SAVE_AREA: return saveArea(state, action);
        case constants.CLEAR_CAMERA_ARR: return clearCameraArr(state, action);
        case constants.INSERT_SCREEN: return insertScreen(state, action);
        default:
            return state;
    }
};

export default reducer;