import { Platform } from 'react-native';
import { check, PERMISSIONS, RESULTS, request, checkMultiple } from 'react-native-permissions';

const PLATFORM_COARSE_LOCATION_PERMISSIONS = {
    ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
    android: PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
}

const PLATFORM_FINE_LOCATION_PERMISSIONS = {
    ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
}

const REQUEST_PERMISSION_TYPE = {
    fine_location: PLATFORM_FINE_LOCATION_PERMISSIONS,
    coarse_location: PLATFORM_COARSE_LOCATION_PERMISSIONS
}

const PERMISSION_TYPE = {
    fine_location: 'fine_location',
    coarse_location: 'coarse_location'
}

class AppPermission {
    
    checkPermission = async (type) => {
        const permission = REQUEST_PERMISSION_TYPE[type][Platform.OS];
        try {
            const result = await check(permission)
            if(result === RESULTS.GRANTED) return true;
            return false;
        } catch(error) {
            return false;
        }
    }

    checkPermissions = async (types) => {
        for(let type of types) {
            try {
                const ans = await this.checkPermission(type);
                if(!ans)
                    return false;
            } catch(error) {
                return false;
            }
        }
        return true;
    }

    requestPermission = async (permissions) => {
        try {
            const result = await request(permissions);
            return result === RESULTS.GRANTED;
        } catch(error) {
            return false;
        }
    }

    requestMultiple = async (types) => {
        for(const type of types) {
            const permission = REQUEST_PERMISSION_TYPE[type][Platform.OS];
            if(permission) {
                const result = await this.requestPermission(permission);
                if(!result)
                    return false;
            }
        }
        return true;
    }
}

const Permission = new AppPermission();
export { Permission, PERMISSION_TYPE }