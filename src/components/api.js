import axios from 'axios';
import constants from '../constants.json';
import { retrieveData, storeData } from '../components/asyncStorage';

const getJWT = async () => {
    const jwt = await retrieveData('jwt')
    .then(res => res);

    return jwt;
}

export const signUpRequest = async (obj) => {
    try {
        const ans = await axios.post(`${constants.BASE_URL}/auth/signup`, obj);
        return ans.data;
    } catch(error) {
        throw error;
    }
}

export const signInRequest = async (obj) => {
    try {
        const ans = await axios.post(`${constants.BASE_URL}/auth/login`, obj);
        return ans.data;
    } catch(error) {
        throw error; 
    }
}

export const resetPassRequest = async (obj) => {
    try {
        const ans = await axios.put(`${constants.BASE_URL}/user/password`,
            obj,
            { headers: {
                'Authorization': `Bearer ${await getJWT()}`
            }
        });
        return ans.data;
    } catch(error) {
        throw error;
    }
}

export const emailVerifyRequest = async (obj) => {
    try {
        const ans = await axios.post(`${constants.BASE_URL}/verify/email`, obj);
        return ans.data;
    } catch(error) {
        throw error;
    }
}

export const signOutRequest = async (obj) => {
    try {
        const ans = await axios.post(`${constants.BASE_URL}/auth/logout`, obj);
        return ans.data;
    } catch(error) {
        throw error;
    }
}

export const getCurrentUserRequest = async (email) => {
    try {
        const ans = await axios.get(`${constants.BASE_URL}/user/${email}`,
            { headers: {
                'Authorization': `Bearer ${await getJWT()}`
            } 
        });
        return ans.data;
    } catch(error) {
        throw error;
    }
}

export const updateUserRequest = async (obj) => {
    try {
        const ans = await axios.put(`${constants.BASE_URL}/user`, obj,
            { headers: {
                'Authorization': `Bearer ${await getJWT()}`
            } 
        });
        return ans.data;
    } catch(error) {
        throw error;
    }
}

export const changePassRequest = async (obj) => {
    try {
        const ans = await axios.put(`${constants.BASE_URL}/user/changePassword`,
            obj,
            { headers: {
                'Authorization': `Bearer ${await getJWT()}`
            } 
        });
        return ans.data;
    } catch(error) {
        throw error;
    }
}

export const addCameraRequest = async (obj) => {
    try {
        const ans = await axios.post(`${constants.BASE_URL}/camera/add-camera`,
            obj,
            { headers: {
                'Authorization': `Bearer ${await getJWT()}`
            } 
        });
        return ans.data;
    } catch(error) {
        throw error;
    }
}

export const getCamerasRequest = async (groupId) => {
    try {
        const ans = await axios.get(`${constants.BASE_URL}/camera/get-by-id/${groupId}`,
            { headers: {
                'Authorization': `Bearer ${await getJWT()}`
            } 
        });
        return ans.data;
    } catch(error) {
        throw error;
    }
}

export const deleteCameraRequest = async (camId) => {
    try {
        const ans = await axios.delete(`${constants.BASE_URL}/camera/${camId}`,
            { headers: {
                'Authorization': `Bearer ${await getJWT()}`
            } 
        });
        return ans.data;
    } catch(error) {
        throw error;
    }
}

export const editCameraRequset = async (obj) => {
    try {
        const ans = await axios.put(`${constants.BASE_URL}/camera/update-camera`,
            obj,
            { headers: {
                'Authorization': `Bearer ${await getJWT()}`
            }     
        });
        return ans.data;
    } catch(error) {
        throw error;
    }
}

export const getGroupIdRequest = async (obj) => {
    try {
        const ans = await axios.get(`${constants.BASE_URL}/localserv?lat=${obj.lat}&lng=${obj.lng}&publicIp=${obj.publicIp}`);
        return ans.data;
    } catch(error) {    
        throw error;
    }
} 

export const getPublicIP = async () => {
    try {
        const ans = await axios.get('https://api.ipify.org');
        return ans.data;
    } catch(error) {
        throw error;
    }
}