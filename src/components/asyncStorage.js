import AsyncStorage from '@react-native-community/async-storage';

export const storeData = async (data) => {
    try {
        await AsyncStorage.setItem(
            data.key,
            JSON.stringify(data.content)
        );
        console.log('[AsyncStorage] storeData: ', data);
    } catch (error) {
        console.log('[AsyncStorage] storeData: ', error.toString());
        throw error;
    }
}

export const retrieveData = async (key) => {
    try {
        const data = await AsyncStorage.getItem(key);
        if(data !== null) {
            console.log('[AsyncStorage] retrieveData: ', data.toString());
            return JSON.parse(data);
        }
    } catch(error) {
        console.log('[AsyncStorage] retrieveData: ', error.toString());
        throw error;
    }
}

export const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        console.log('[AsyncStorage] removeData: ', key.toString());
    } catch(error) {
        console.log('[AsyncStorage] removeData: ', error.toString());
        throw error;
    }
}