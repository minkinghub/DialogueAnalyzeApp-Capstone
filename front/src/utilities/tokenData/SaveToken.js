import AsyncStorage from '@react-native-async-storage/async-storage';

export const SaveToken = async ( tokens ) => {
    try {
        await AsyncStorage.setItem('access_token', tokens.access_token);
        await AsyncStorage.setItem('refresh_token', tokens.refresh_token);
        await AsyncStorage.setItem('isFirst', String(tokens.isFirst));

        console.log("Success save data");
    } catch (error) {
        console.error('Failed to save tokens:', error);
    }
}